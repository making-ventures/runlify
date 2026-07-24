import {getLinksOfEntities} from './links/getLinksOfEntities'
import {BootstrapEntityOptions, LinkedEntities} from './types'
import {
  DataBaseMeta,
  Entity,
  InfoRegistry,
  SumRegistry,
  System,
  Document,
  Catalog,
  AdditionalService,
} from './builders/buildedTypes'
import {validateEntityDatabaseName} from './utils/databaseMeta'
import {getLinksToExternalEntities} from './links/getLinksToExternalEntities'
import {getLinksFromExternalEntities} from './links/getLinksFromExternalEntities'
import * as R from 'ramda'

export interface ProjectWideGenerationArgs {
  system: System
  entities: Entity[]
  allEntities: Map<string, Entity>
  allSumRegistries: Map<string, SumRegistry>
  allInfoRegistries: Map<string, InfoRegistry>
  allDocuments: Map<string, Document>
  allCatalogs: Map<string, Catalog>
  allLinks: LinkedEntities[]
  additionalServices: AdditionalService[]
  options: BootstrapEntityOptions
}

export interface EntityWideGenerationArgs extends ProjectWideGenerationArgs {
  entity: Entity
  fromLinks: LinkedEntities[]
  toLinks: LinkedEntities[]
}

export interface AdditionalServiceWideGenerationArgs extends ProjectWideGenerationArgs {
  service: AdditionalService
}

const withEntityDatabaseDefault = (e: Entity): Entity => ({
  ...e,
  database: (e as {database?: string}).database ?? 'main',
})

const normalizeDataBasesFromSystem = (system: System): DataBaseMeta[] => {
  const raw = system.dataBases
  if (!raw?.length) {
    throw new Error(
      'System metadata is missing dataBases. Rebuild system meta so dataBases is populated (main plus any addDatabase names).',
    )
  }
  for (const db of raw) {
    validateEntityDatabaseName(db.name)
  }
  const names = raw.map((d) => d.name)
  const uniq = new Set(names)
  if (uniq.size !== names.length) {
    throw new Error(`Duplicate database names in system.dataBases: ${names.join(', ')}`)
  }
  if (!uniq.has('main')) {
    throw new Error('system.dataBases must include a database named "main".')
  }
  const others = names.filter((d) => d !== 'main').sort((a, b) => a.localeCompare(b))
  return [{name: 'main'}, ...others.map((name) => ({name}))]
}

export const prepareProjectWideGenerationArgs = (
  system: System,
  opts: BootstrapEntityOptions
): ProjectWideGenerationArgs => {
  const entitiesRaw = R.sortBy(R.prop('name'), [
    ...system.catalogs,
    ...system.documents,
    ...system.infoRegistries,
    ...system.sumRegistries,
  ])

  const entities = entitiesRaw.map(withEntityDatabaseDefault)

  const dataBases = normalizeDataBasesFromSystem(system)
  const allowedDbNames = new Set(dataBases.map((d) => d.name))
  for (const ent of entities) {
    validateEntityDatabaseName(ent.database)
    if (!allowedDbNames.has(ent.database)) {
      const known = [...allowedDbNames].sort((a, b) => a.localeCompare(b)).join(', ')
      throw new Error(
        `Entity "${ent.name}" uses database "${ent.database}", which is not listed in system.dataBases. ` +
          `Known databases: ${known}`,
      )
    }
  }

  const systemNormalized: System = {
    ...system,
    dataBases,
    generationPaths: system.generationPaths ?? {overrides: {}},
  }

  const allEntities: Map<string, Entity> = new Map()
  for (const entity of entities) {
    allEntities.set(entity.name, entity)
  }

  const allSumRegistries: Map<string, SumRegistry> = new Map()
  for (const entity of entities) {
    if (entity.type === 'sumRegistry') {
      allSumRegistries.set(entity.name, entity)
    }
  }

  const allInfoRegistries: Map<string, InfoRegistry> = new Map()
  for (const entity of entities) {
    if (entity.type === 'infoRegistry') {
      allInfoRegistries.set(entity.name, entity)
    }
  }

  const allDocuments: Map<string, Document> = new Map()
  for (const entity of entities) {
    if (entity.type === 'document') {
      allDocuments.set(entity.name, entity)
    }
  }

  const allCatalogs: Map<string, Catalog> = new Map()
  for (const entity of entities) {
    if (entity.type === 'catalog') {
      allCatalogs.set(entity.name, entity)
    }
  }

  const allLinks = getLinksOfEntities(entities)

  return {
    system: systemNormalized,
    entities,
    allDocuments,
    allCatalogs,
    allEntities,
    allSumRegistries,
    allInfoRegistries,
    allLinks,
    additionalServices: system.additionalServices,
    options: opts,
  }
}

export const prepareEntityWideGenerationArgs = (
  projectWideGenerationArgs: ProjectWideGenerationArgs,
  entity: Entity
): EntityWideGenerationArgs => ({
  ...projectWideGenerationArgs,
  entity,
  toLinks: getLinksFromExternalEntities(
    entity,
    projectWideGenerationArgs.allLinks
  ),
  fromLinks: getLinksToExternalEntities(
    entity,
    projectWideGenerationArgs.allLinks
  ),
})

export const prepareAdditionalServiceWideGenerationArgs = (
  projectWideGenerationArgs: ProjectWideGenerationArgs,
  service: AdditionalService
): AdditionalServiceWideGenerationArgs => ({
  ...projectWideGenerationArgs,
  service,
})
