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
  const {databaseMainWriteUri} = await getConfig();

  log.info(appName, typeof addParamsToDatabaseUri);

  // const url = addParamsToDatabaseUri(databaseMainWriteUri {
  //   application_name: appName,
  //   ...(process.env.NODE_ENV === 'production' ? {} : {connection_limit: '1'}),
  // });

  if (!knexInstance) {
    knexInstance = knex({
      client: 'pg',
      connection: databaseMainWriteUri,
    });
  }

  return knexInstance;
};
`
