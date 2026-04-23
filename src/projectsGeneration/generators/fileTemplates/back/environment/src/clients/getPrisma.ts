import {camelCase} from 'change-case'
import {pascal} from '../../../../../../../utils/cases'
import {ProjectWideGenerationArgs} from '../../../../../../args'

export const prismaGetterTmpl = (args: ProjectWideGenerationArgs) => {
  const otherDbs = args.system.dataBases
    .map((d) => d.name)
    .filter((d) => d !== 'main')

  const extraImports = otherDbs
    .map(
      (db) =>
        `import {PrismaClient as PrismaClient${pascal(
          db,
        )}} from '../../prisma/databases/${db}/client';`,
    )
    .join('\n')

  const extraGetters = otherDbs.map((db) => {
    const p = pascal(db)
    const writeKey = camelCase(`database.${db}.write.uri`)
    const readUriKey = camelCase(`database.${db}.readOnly.uri`)
    const readEnabledKey = camelCase(`database.${db}.readOnly.enabled`)

    return `
let prisma${p}: PrismaClient${p} | null = null;

export const getPrisma${p} = async (connectionType: 'write' | 'readOnly') => {
  const cfg = (await getConfig()) as Record<string, unknown>;
  const writeUri = cfg['${writeKey}'] as string;
  const readOnlyUri = cfg['${readUriKey}'] as string | undefined;
  const readOnlyEnabled = cfg['${readEnabledKey}'] as boolean;

  let uri: string;

  if (connectionType === 'write') {
    uri = writeUri;
  } else {
    if (!readOnlyEnabled) {
      const msg = 'Read only database connection cannot be used with the database.${db}.readOnly.enabled is not true';
      return new Proxy({} as any, {
        get(_target: PrismaClient${p}, property: string | symbol) {
          if (property === 'then') {
            return undefined;
          }
          if (property === '$disconnect') {
            return () => log.info('noop $disconnect');
          }
          log.error(\`getPrisma${p}: \${property.toString()}\`);
          log.error(msg);
          throw new Error(msg);
        },
        apply: () => {
          log.error('apply');
          log.error(msg);
          throw new Error(msg);
        },
      }) as PrismaClient${p};
    }
    if (!readOnlyUri) {
      throw new Error('database.${db}.readOnly.uri must be set');
    }
    uri = readOnlyUri;
  }

  if (!prisma${p}) {
    prisma${p} = new PrismaClient${p}({
      datasources: {
        db: {
          url: uri,
        },
      },
    });
  }

  return prisma${p};
};
`
  })

  return `import {PrismaClient} from '@prisma/client';
${extraImports}
import {getConfig} from '../config';
import log from '../log';
import {addParamsToDatabaseUri} from '../utils/addParamsToPgUri';

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
      const msg = 'Read only database connection cannot be used with the database.main.readOnly.enabled is not true';
      return new Proxy({} as any, {
        get(_target: PrismaClient, property: string | symbol) {
          if (property === 'then') {
            return undefined;
          }

          if (property === '$disconnect') {
            return () => log.info('noop $disconnect');
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
      }) as PrismaClient;
    }

    if (!databaseMainReadOnlyUri) {
      throw new Error('database.main.readOnly.uri must be set');
    }

    uri = databaseMainReadOnlyUri;
  }

  log.info(typeof addParamsToDatabaseUri);

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
${extraGetters.join('')}
`
}
