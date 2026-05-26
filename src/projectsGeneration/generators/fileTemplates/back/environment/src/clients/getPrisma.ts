import {camelCase} from 'change-case'
import {pascal} from '../../../../../../../utils/cases'
import {ProjectWideGenerationArgs} from '../../../../../../args'

const buildExtraGetter = (
  db: string,
  p7: boolean,
): string => {
  const p = pascal(db)
  const writeKey = camelCase(`database.${db}.write.uri`)
  const readUriKey = camelCase(`database.${db}.readOnly.uri`)
  const readEnabledKey = camelCase(`database.${db}.readOnly.enabled`)

  if (p7) {
    return `
const prisma${p}ByUri = new Map<string, PrismaClient${p}>();

export const getPrisma${p} = async (connectionType: 'write' | 'readOnly') => {
  const {
    ${writeKey}: writeUri,
    ${readUriKey}: readOnlyUri,
    ${readEnabledKey}: readOnlyEnabled,
  } = await getConfig();

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

  let prisma${p} = prisma${p}ByUri.get(uri);
  if (!prisma${p}) {
    prisma${p} = createPgPrismaClient(PrismaClient${p}, uri);
    prisma${p}ByUri.set(uri, prisma${p});
  }

  return prisma${p};
};
`
  }

  return `
let prisma${p}: PrismaClient${p} | null = null;

export const getPrisma${p} = async (connectionType: 'write' | 'readOnly') => {
  const {
    ${writeKey}: writeUri,
    ${readUriKey}: readOnlyUri,
    ${readEnabledKey}: readOnlyEnabled,
  } = await getConfig();

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
}

export const prismaGetterTmpl = (args: ProjectWideGenerationArgs, prismaMajor?: number) => {
  const p7 = (prismaMajor ?? 6) >= 7
  const otherDbs = args.system.dataBases
    .map((d) => d.name)
    .filter((d) => d !== 'main')

  const extraImports = otherDbs
    .map(
      (db) =>
        `import {PrismaClient as PrismaClient${pascal(
          db,
        )}} from '${p7 ? `@prisma/${db}/client` : `../../prisma/databases/${db}/client`}';`,
    )
    .join('\n')

  const extraGetters = otherDbs.map((db) => buildExtraGetter(db, p7)).join('')

  const mainGetter = p7
    ? `
const prismaByUri = new Map<string, PrismaClient>();

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

  let prisma = prismaByUri.get(uri);
  if (!prisma) {
    prisma = createPgPrismaClient(PrismaClient, uri);
    prismaByUri.set(uri, prisma);
  }

  return prisma;
};
`
    : `
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
`

  const p7Imports = p7
    ? `import {createPgPrismaClient} from './createPgPrismaClient';
`
    : `import {addParamsToDatabaseUri} from '../utils/addParamsToPgUri';
`

  return `import {PrismaClient} from '@prisma/client';
${extraImports}
import {getConfig} from '../config';
import log from '../log';
${p7Imports}
${mainGetter}
${extraGetters}
`
}
