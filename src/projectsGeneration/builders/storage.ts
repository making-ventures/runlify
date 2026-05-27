export type StorageType =
  | 'postgres'
  | 'elastic'
  | 'clickhouse'
  | 'postgres_with_elastic_search'
  | 'postgres_with_clickhouse_search';

export type SearchEngine = 'elastic' | 'clickhouse';

export const Storage = {
  POSTGRES: 'postgres',
  ELASTIC: 'elastic',
  CLICKHOUSE: 'clickhouse',
  POSTGRES_WITH_ELASTIC_SEARCH: 'postgres_with_elastic_search',
  POSTGRES_WITH_CLICKHOUSE_SEARCH: 'postgres_with_clickhouse_search',
} as const satisfies Record<string, StorageType>;

export const isStoragePostgres = (storage: StorageType): boolean =>
  storage === Storage.POSTGRES
  || storage === Storage.POSTGRES_WITH_ELASTIC_SEARCH
  || storage === Storage.POSTGRES_WITH_CLICKHOUSE_SEARCH;

export const isStorageElasticOnly = (storage: StorageType): boolean =>
  storage === Storage.ELASTIC;

export const isStorageClickHouseOnly = (storage: StorageType): boolean =>
  storage === Storage.CLICKHOUSE;

export const isStorageExternalSearch = (storage: StorageType): boolean =>
  storage === Storage.POSTGRES_WITH_ELASTIC_SEARCH
  || storage === Storage.POSTGRES_WITH_CLICKHOUSE_SEARCH;

export const isStorageElasticSearch = (storage: StorageType): boolean =>
  storage === Storage.ELASTIC
  || storage === Storage.POSTGRES_WITH_ELASTIC_SEARCH;

export const isStorageClickHouseSearch = (storage: StorageType): boolean =>
  storage === Storage.CLICKHOUSE
  || storage === Storage.POSTGRES_WITH_CLICKHOUSE_SEARCH;

export const getSearchEngine = (storage: StorageType): SearchEngine | null => {
  switch (storage) {
    case Storage.POSTGRES_WITH_ELASTIC_SEARCH:
    case Storage.ELASTIC:
      return 'elastic';
    case Storage.POSTGRES_WITH_CLICKHOUSE_SEARCH:
    case Storage.CLICKHOUSE:
      return 'clickhouse';
    default:
      return null;
  }
};

export const getSearchServicePrefix = (storage: StorageType): 'Elastic' | 'ClickHouse' | null => {
  const engine = getSearchEngine(storage);

  if (engine === 'elastic') {
    return 'Elastic';
  }

  if (engine === 'clickhouse') {
    return 'ClickHouse';
  }

  return null;
};

export const usesPrismaDelegate = (storage: StorageType): boolean =>
  !isStorageElasticOnly(storage) && !isStorageClickHouseOnly(storage);

export const getConfigExternalSearch = (storage: StorageType): boolean =>
  isStorageExternalSearch(storage);

export const entityUsesElasticBootstrap = (storage: StorageType): boolean =>
  isStorageElasticSearch(storage);

export const entityUsesClickHouseBootstrap = (storage: StorageType): boolean =>
  isStorageClickHouseSearch(storage);
