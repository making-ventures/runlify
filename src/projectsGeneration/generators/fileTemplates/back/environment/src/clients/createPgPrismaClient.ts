export const createPgPrismaClientTmpl = (): string => `import {PrismaPg} from '@prisma/adapter-pg';
import {Pool} from 'pg';
import {addParamsToDatabaseUri} from '../utils/addParamsToPgUri';

type PrismaPgClientOptions = {
  adapter: PrismaPg;
  log?: Array<{emit: 'event'; level: 'error' | 'warn'}>;
};

type PrismaClientConstructor<T> = new (options: PrismaPgClientOptions) => T;

type DisconnectableClient = {
  $disconnect: () => Promise<void>;
};

const defaultConnectionParams = (): Record<string, string> =>
  process.env.NODE_ENV === 'production' ? {} : {connection_limit: '1'};

export const createPgPrismaClient = <T extends DisconnectableClient>(
  PrismaClientClass: PrismaClientConstructor<T>,
  uri: string,
  log?: PrismaPgClientOptions['log'],
  connectionParams: Record<string, string> = defaultConnectionParams(),
): T => {
  const connectionString = addParamsToDatabaseUri(uri, connectionParams);
  const pool = new Pool({connectionString});
  const adapter = new PrismaPg(pool);
  const client = new PrismaClientClass(log ? {adapter, log} : {adapter});

  const originalDisconnect = client.$disconnect.bind(client);
  client.$disconnect = async () => {
    await originalDisconnect();
    await pool.end();
  };

  return client;
};
`
