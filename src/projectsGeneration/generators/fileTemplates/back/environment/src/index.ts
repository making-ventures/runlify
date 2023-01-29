import {
  BootstrapEntityOptions,
  defaultBootstrapEntityOptions,
} from '../../../../../types'
import { generatedWarning } from '../../../../../utils'

export const environmentIndexTmpl = (
  options: BootstrapEntityOptions = defaultBootstrapEntityOptions
) => `import {exitHook} from './utils/exitHook';
import log from './log';
import {createContext} from './adm/services/context';
import express, {RequestHandler} from 'express';
import cors from 'cors';
import passport from 'passport';
import {json, raw} from 'body-parser';
import restRouter from './rest/restRouter';
import helmet from 'helmet';
import {initAdmPassport} from './adm/config/passport';${options.usersEnabled ? `
import {initAppPassport} from './app/config/passport';
import appAuthRouter from './app/authRouter';
import getAppServer from './app/getAppServer';` : ''}
import admAuthRouter from './adm/authRouter';
import {graphqlUploadExpress} from 'graphql-upload';
import defaultContainer from './adm/services/defaultContainer';
import healthRouter from './rest/healthRouter';
import expressPlayground from 'graphql-playground-middleware-express';
import getAdmServer from './adm/getAdmServer';
import getMetricsHandler from './rest/getMetricsHandler';
${
  options.skipWarningThisIsGenerated
    ? ''
    : `
// ${generatedWarning}
`
}
exitHook(async () => {
  createContext().then(ctx => ctx.close());
});

const app = express();
${options.usersEnabled ? `
initAppPassport();` : ''}
initAdmPassport();

const production = process.env.NODE_ENV === 'production';
log.info(\`production: \${production}\`);

app.use(cors());
app.use(raw({limit: '50mb'}) as RequestHandler);
app.use(json({limit: '1mb'}) as RequestHandler);
app.use(
  helmet(
    {
      contentSecurityPolicy: production ? undefined : false,
      crossOriginEmbedderPolicy: production ? undefined : false,
    },
  ) as RequestHandler,
);
app.use(passport.initialize() as RequestHandler);
${options.usersEnabled ? `
app.use('/app/rest', appAuthRouter);` : ''}
app.use('/adm/rest', admAuthRouter);

app.use('/rest', restRouter);

app.use('/health', healthRouter);

const start = async () => {
  const ctx = await createContext(defaultContainer);

  app.get('/metrics', getMetricsHandler(ctx));

  app.use('/app/graph', passport.authenticate('appJwt', {session: false}));
  app.use('/app/graph', graphqlUploadExpress({maxFiles: 10, maxFileSize: 50 * 1024 * 1024}) as RequestHandler);
${options.usersEnabled ? `
  const appServer = getAppServer();
  await appServer.start();
  appServer.applyMiddleware({app, path: '/app/graph'});
` : ''}
  const admServer = getAdmServer();

  const admGraphPath = '/adm/graph';
  app.use(admGraphPath, passport.authenticate('admJwt', {session: false}));
  app.use(admGraphPath, graphqlUploadExpress({maxFiles: 10, maxFileSize: 50 * 1024 * 1024}) as RequestHandler);
  await admServer.start();
  admServer.applyMiddleware({app, path: admGraphPath});

  ctx.service('stats').updateGauges();

  const port = 3000;
  const graphEndpoint = \`http://localhost:\${port}\${admServer.graphqlPath}\`;

  if (!production) {
    app.get(
      '/playground',
      expressPlayground({
        endpoint: graphEndpoint,
      }),
    );

    log.info(\`🚀 GraphQL playground at http://localhost:\${port}/playground\`);
  }

  app.listen({port}, () => {
    log.info(\`🚀 Server ready at \${graphEndpoint}\`);
  });
};

start().catch(error => {
  // eslint-disable-next-line no-console
  console.error(error);

  throw error;
});
`
