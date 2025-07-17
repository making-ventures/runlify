import {
  BootstrapEntityOptions,
  defaultBootstrapEntityOptions,
} from '../../../../../types'
import {printWarningIfRequired} from '../../../../../utils'

export const environmentIndexTmpl = (
  options: BootstrapEntityOptions = defaultBootstrapEntityOptions
) => `import './tracing'; // Import tracing first to ensure instrumentation is set up

import log from './log';
import {createContext} from './adm/services/context';
import express from 'express';
import defaultContainer from './adm/services/defaultContainer';
import initEndpoints from './initEndpoints';
import expressListEndpoints from 'express-list-endpoints';
${printWarningIfRequired(options)}
const app = express();

const start = async () => {
  const ctx = await createContext(defaultContainer);
  const port = 3000;

  const production = process.env.NODE_ENV === 'production';
  log.info(\`production: \${production}\`);

  await initEndpoints(app, ctx, port, production);

  app.listen({port}, () => {
    log.info('🚀 Server ready\\n' +
      expressListEndpoints(app).map(e => \` ➜ http://localhost:\${port}\${e.path} [\${e.methods}]\`).join('\\n'));
  });
};

start().catch(error => {
  // eslint-disable-next-line no-console
  console.error(error);

  throw error;
});
`
