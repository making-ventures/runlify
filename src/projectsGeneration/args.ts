import { getLinksOfEntities } from './links/getLinksOfEntities'
import { BootstrapEntityOptions, LinkedEntities } from './types'
import {
  Entity,
  InfoRegistry,
  SumRegistry,
  System,
  Document,
  Catalog,
} from './builders/buildedTypes'
import { getLinksToExternalEntities } from './links/getLinksToExternalEntities'
import { getLinksFromExternalEntities } from './links/getLinksFromExternalEntities'
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
  options: BootstrapEntityOptions
}

export interface EntityWideGenerationArgs extends ProjectWideGenerationArgs {
  entity: Entity
  fromLinks: LinkedEntities[]
  toLinks: LinkedEntities[]
}

export const prepareProjectWideGenerationArgs = (
  system: System,
  opts: BootstrapEntityOptions
): ProjectWideGenerationArgs => {
  const entities = R.sortBy(R.prop('name'), [
    ...system.catalogs,
    ...system.documents,
    ...system.infoRegistries,
    ...system.sumRegistries,
  ])

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
    system,
    entities,
    allDocuments,
    allCatalogs,
    allEntities,
    allSumRegistries,
    allInfoRegistries,
    allLinks,
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
