import {snakeCase} from 'change-case'

import {ConfigVar} from '../builders/buildedTypes'

const ENTITY_DATABASE_NAME_RE = /^[a-z][a-zA-Z0-9]*$/

export const postgresUrlDatabaseName = (metaDbName: string): string =>
  metaDbName === 'main' ? 'postgres' : snakeCase(metaDbName)

export const validateEntityDatabaseName = (name: string): void => {
  if (name === 'main') {
    return
  }
  if (!ENTITY_DATABASE_NAME_RE.test(name)) {
    throw new Error(
      `Invalid database name "${name}": use a reserved "main" or an identifier matching ${ENTITY_DATABASE_NAME_RE}.`,
    )
  }
}

/** Config vars for a non-main database (mirrors database.main.* in SystemMetaBuilder). */
export const buildConfigVarsForAdditionalDatabase = (
  dbName: string,
): ConfigVar[] => {
  const titleBase = `База данных "${dbName}"`
  const defaultBase = `postgresql://postgres:password@localhost:5432/${postgresUrlDatabaseName(dbName)}`
  return [
    {
      name: `database.${dbName}.write.uri`,
      type: 'string' as const,
      required: true,
      default: defaultBase,
      needFor: `${titleBase}: строка подключения для записи`,
      scopes: ['back', 'worker', 'telegramBot'],
      hidden: true,
      editable: false,
    },
    {
      name: `database.${dbName}.readOnly.uri`,
      type: 'string' as const,
      required: false,
      default: defaultBase,
      needFor: `${titleBase}: строка подключения только для чтения`,
      scopes: ['back', 'worker', 'telegramBot'],
      hidden: true,
      editable: false,
    },
    {
      name: `database.${dbName}.readOnly.enabled`,
      type: 'bool' as const,
      required: true,
      default: false,
      needFor: `${titleBase}: включено ли отдельное подключение для чтения`,
      scopes: ['back', 'worker', 'telegramBot'],
      hidden: false,
      editable: true,
    },
    {
      name: `database.${dbName}.migration.uri`,
      type: 'string' as const,
      required: true,
      default: defaultBase,
      needFor: `${titleBase}: строка подключения для миграций (без pgbouncer)`,
      scopes: ['back', 'worker', 'telegramBot'],
      hidden: true,
      editable: false,
    },
  ] as unknown as ConfigVar[]
}

export const databaseNameToEnvSuffix = (dbName: string): string =>
  dbName.replace(/([A-Z])/gu, '_$1').replace(/^_/, '').toUpperCase()

export const prismaDatasourceWriteEnvVar = (database: string): string =>
  database === 'main'
    ? 'DATABASE_MAIN_WRITE_URI'
    : `DATABASE_${databaseNameToEnvSuffix(database)}_WRITE_URI`

export const prismaDatasourceMigrationEnvVar = (database: string): string =>
  database === 'main'
    ? 'DATABASE_MAIN_MIGRATION_URI'
    : `DATABASE_${databaseNameToEnvSuffix(database)}_MIGRATION_URI`
