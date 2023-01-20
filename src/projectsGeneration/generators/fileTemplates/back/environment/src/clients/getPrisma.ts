import {
  BootstrapEntityOptions,
  defaultBootstrapEntityOptions,
} from '../../../../../../types'
import { generatedWarning } from '../../../../../../utils'

export const prismaGetterTmpl = (
  options: BootstrapEntityOptions = defaultBootstrapEntityOptions
) => `import {PrismaClient} from '@prisma/client';
import {getConfig} from '../config';
import log from '../log';
import {addParamsToDatabaseUri} from '../utils/addParamsToPgUri';
${
  options.skipWarningThisIsGenerated
    ? ''
    : `
// ${generatedWarning}
`
}
let prisma: PrismaClient | null = null;

export const getPrisma = async (connectionType: 'write' | 'readOnly') => {
  const {
    databaseMainWriteUri,
    databaseMainReadOnlyUri,
    databaseMainReadOnlyEnabled,
  } = await getConfig();

  let uri: string;

  if (connectionType === 'write') {
    uri = databaseMainWriteUri;
  } else {
    if (!databaseMainReadOnlyEnabled) {
      return new Proxy({}, {
        get() {
          throw new Error('Read only database connection cannot be used with the database.main.readOnly.enabled is not true');
        },
        apply: () => {
          throw new Error('Read only database connection cannot be used with the database.main.readOnly.enabled is not true');
        },
      });
    }

    if (!databaseMainReadOnlyUri) {
      throw new Error('database.main.readOnly.uri must be set');
    }

    uri = databaseMainReadOnlyUri;
  }

  log.info(typeof addParamsToDatabaseUri);

  // const url = addParamsToDatabaseUri(databaseMainWriteUri, {
  //   application_name: appName,
  //   ...(process.env.NODE_ENV === 'production' ? {} : {connection_limit: '1'}),
  // });

  if (!prisma) {
    prisma = new PrismaClient({
      datasources: {
        db: {
          url: uri,
        },
      },
    });
  }

  return prisma;
};
`
