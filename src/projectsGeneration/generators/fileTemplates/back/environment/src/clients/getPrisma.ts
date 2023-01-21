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
      return new Promise(
        (resolve) => {
          const msg = 'Read only database connection cannot be used with the database.main.readOnly.enabled is not true';
          resolve(new Proxy({} as any, {
            get(_target: PrismaClient, property: string | symbol) {
              if (property === 'then') {
                return undefined;
              }

              log.error(\`get: \${property.toString()}\`);

              log.error(msg);
              throw new Error(msg);
            },
            apply: () => {
              log.error('apply');
              log.error(msg);
              throw new Error(msg);
            },
          }) as PrismaClient);
        },
      );
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
