import {
  BootstrapEntityOptions,
  defaultBootstrapEntityOptions,
} from '../../../../../../types'
import { generatedWarning } from '../../../../../../utils'

export const knexGetterTmpl = (
  options: BootstrapEntityOptions = defaultBootstrapEntityOptions
) => `import {getConfig} from '../config';
import knex, {Knex} from 'knex';
import log from '../log';
import {addParamsToDatabaseUri} from '../utils/addParamsToPgUri';
${
  options.skipWarningThisIsGenerated
    ? ''
    : `
// ${generatedWarning}
`
}
let knexInstance: Knex | null = null;

export const getKnex = async (appName = 'someBack_Knex') => {
  const config = await getConfig();

  log.info(appName, typeof addParamsToDatabaseUri);

  // const url = addParamsToDatabaseUri(config.databaseUri, {
  //   application_name: appName,
  //   ...(process.env.NODE_ENV === 'production' ? {} : {connection_limit: '1'}),
  // });

  const url = config.databaseUri;

  if (!knexInstance) {
    knexInstance = knex({
      client: 'pg',
      connection: url,
    });
  }

  return knexInstance;
};
`
