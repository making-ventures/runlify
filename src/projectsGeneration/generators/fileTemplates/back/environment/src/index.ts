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
${printWarningIfRequired(options)}
const app = express();

const start = async () => {
  const ctx = await createContext(defaultContainer);
  const port = 3000;

  const production = process.env.NODE_ENV === 'production';
  log.info(\`production: \${production}\`);

  const endpoints = await initEndpoints(app, ctx, port, production);

  app.listen({port}, () => {
    log.info('\\n' + endpoints.map(e => \`🚀 Server ready at \${e}\`).join('\\n'));
  });
};

start().catch(error => {
  // eslint-disable-next-line no-console
  console.error(error);

  throw error;
});
`
