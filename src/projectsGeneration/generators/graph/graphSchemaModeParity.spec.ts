import {expect} from 'jest-without-globals'
import CatalogBuilder from '../../builders/CatalogBuilder'
import DocumentBuilder from '../../builders/DocumentBuilder'
import {Entity} from '../../builders/buildedTypes'
import {EntityWideGenerationArgs} from '../../args'
import {backBaseResolversTmpl} from '../fileTemplates/back/graph/resolvers'
import {backBasePermissionToGraphqlTmpl} from '../fileTemplates/back/graph/entityBasePermissionToGraphql'
import {genGraphCrudResolvers} from './genGraphCrudResolvers'
import {genGraphCrudPermissions} from './genGraphCrudPermissions'
import {RuntimeGraphContext, RuntimeCrudService} from './runtimeGraphTypes'

// yarn test --testPathPattern graphSchemaModeParity

const argsFor = (entity: Entity): EntityWideGenerationArgs =>
  ({entity} as unknown as EntityWideGenerationArgs)

// backBaseResolversTmpl prints one top-level `Query: { ... }, Mutation: { ... }`
// object whose field names are always indented by exactly 4 spaces; splitting
// on the (unique) `Mutation: {` marker and then regex-scanning each half for
// 4-space-indented identifiers recovers the field names without needing a
// real TS parser.
const splitQueryMutationBlocks = (tmplSrc: string) => {
  const mutationStart = tmplSrc.indexOf('Mutation: {')
  return {
    queryBlock: tmplSrc.slice(tmplSrc.indexOf('Query: {'), mutationStart),
    mutationBlock: tmplSrc.slice(mutationStart),
  }
}

const extractTopLevelKeys = (block: string): string[] => {
  const keys: string[] = []
  const keyRegex = /\n {4}([A-Za-z_][A-Za-z0-9_]*):/g
  let match: RegExpExecArray | null
  while ((match = keyRegex.exec(block))) {
    keys.push(match[1])
  }
  return keys
}

const extractResolverKeysFromTmpl = (entity: Entity) => {
  const src = backBaseResolversTmpl(argsFor(entity))
  const {queryBlock, mutationBlock} = splitQueryMutationBlocks(src)
  return {
    query: extractTopLevelKeys(queryBlock),
    mutation: extractTopLevelKeys(mutationBlock),
  }
}

const extractPermissionsFromTmpl = (entity: Entity): Record<string, string> => {
  const src = backBasePermissionToGraphqlTmpl(argsFor(entity))
  const permissions: Record<string, string> = {}
  const entryRegex = /(\w+): '([^']+)'/g
  let match: RegExpExecArray | null
  while ((match = entryRegex.exec(src))) {
    permissions[match[1]] = match[2]
  }
  return permissions
}

describe('graphSchemaModeParity', () => {
  describe('resolvers: genGraphCrudResolvers matches backBaseResolversTmpl', () => {
    test('catalog (non-document) entity', () => {
      const cards = new CatalogBuilder('cards', 'ru')
      cards.addField('name').setType('string').setRequired()
      const entity = cards.build()

      const fromTmpl = extractResolverKeysFromTmpl(entity)
      const fromRuntime = genGraphCrudResolvers(entity)

      expect(Object.keys(fromRuntime.Query).sort()).toEqual(
        fromTmpl.query.sort()
      )
      expect(Object.keys(fromRuntime.Mutation).sort()).toEqual(
        fromTmpl.mutation.sort()
      )
    })

    test('document entity (covers rePost)', () => {
      const invoices = new DocumentBuilder('invoices', 'ru')
      invoices.addField('amount').setType('int').setRequired()
      const entity = invoices.build()

      const fromTmpl = extractResolverKeysFromTmpl(entity)
      const fromRuntime = genGraphCrudResolvers(entity)

      expect(Object.keys(fromRuntime.Query).sort()).toEqual(
        fromTmpl.query.sort()
      )
      expect(Object.keys(fromRuntime.Mutation).sort()).toEqual(
        fromTmpl.mutation.sort()
      )
      expect(Object.keys(fromRuntime.Mutation)).toContain('rePostInvoice')
    })
  })

  describe('permissions: genGraphCrudPermissions matches backBasePermissionToGraphqlTmpl', () => {
    test('catalog entity', () => {
      const cards = new CatalogBuilder('cards', 'ru')
      cards.addField('name').setType('string').setRequired()
      const entity = cards.build()

      expect(genGraphCrudPermissions(entity)).toEqual(
        extractPermissionsFromTmpl(entity)
      )
    })

    test('document entity', () => {
      const invoices = new DocumentBuilder('invoices', 'ru')
      invoices.addField('amount').setType('int').setRequired()
      const entity = invoices.build()

      expect(genGraphCrudPermissions(entity)).toEqual(
        extractPermissionsFromTmpl(entity)
      )
    })
  })

  describe('resolvers: behavior — dispatches to the right service method', () => {
    const makeSpyContext = () => {
      const service: Record<keyof RuntimeCrudService, ReturnType<typeof jest.fn>> = {
        get: jest.fn(),
        all: jest.fn(),
        meta: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
        rePost: jest.fn(),
      }
      const context: RuntimeGraphContext = {
        service: jest.fn(() => service as unknown as RuntimeCrudService),
      }
      return {service, context}
    }

    test('catalog entity CRUD resolvers', () => {
      const cards = new CatalogBuilder('cards', 'ru')
      cards.addField('name').setType('string').setRequired()
      const entity = cards.build()
      const resolvers = genGraphCrudResolvers(entity)
      const {service, context} = makeSpyContext()

      resolvers.Query.Card(null, {id: 5}, {context})
      expect(service.get).toHaveBeenCalledWith(5, true)

      resolvers.Query.allCards(null, {page: 1}, {context})
      expect(service.all).toHaveBeenCalledWith({page: 1}, true)

      resolvers.Query._allCardsMeta(null, {page: 1}, {context})
      expect(service.meta).toHaveBeenCalledWith({page: 1}, true)

      resolvers.Mutation.createCard(null, {name: 'x'}, {context})
      expect(service.create).toHaveBeenCalledWith({name: 'x'}, true)

      resolvers.Mutation.updateCard(null, {id: 5, name: 'y'}, {context})
      expect(service.update).toHaveBeenCalledWith({id: 5, name: 'y'}, true)

      resolvers.Mutation.removeCard(null, {id: 5}, {context})
      expect(service.delete).toHaveBeenCalledWith({id: 5}, true)

      expect(context.service).toHaveBeenCalledWith('cards')
    })

    test('document entity rePost resolver', () => {
      const invoices = new DocumentBuilder('invoices', 'ru')
      invoices.addField('amount').setType('int').setRequired()
      const entity = invoices.build()
      const resolvers = genGraphCrudResolvers(entity)
      const {service, context} = makeSpyContext()

      resolvers.Mutation.rePostInvoice(null, {id: 7}, {context})
      expect(service.rePost).toHaveBeenCalledWith(7, true)
      expect(context.service).toHaveBeenCalledWith('invoices')
    })
  })
})
