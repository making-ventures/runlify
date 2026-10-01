import {expect} from 'jest-without-globals'
import CatalogBuilder from '../../../../builders/CatalogBuilder'
import {defaultBootstrapEntityOptions} from '../../../../types'
import {EntityWideGenerationArgs} from '../../../../args'
import {Entity} from '../../../../builders/buildedTypes'
import {FileCreator} from '../../types'
import generateBackEntityGraph from './generateBackEntityGraph'

// yarn test --testPathPattern generateBackEntityGraph

const makeArgs = (
  entity: Entity,
  graphSchemaMode: 'files' | 'runtime_meta'
): EntityWideGenerationArgs =>
  ({
    entity,
    fromLinks: [],
    toLinks: [],
    system: {generationPaths: null},
    options: {
      ...defaultBootstrapEntityOptions,
      detachedBackProject: 'D:/work/rlw-back',
      detachedUiProject: 'D:/work/rlw-ui',
      graphSchemaMode,
    },
  } as unknown as EntityWideGenerationArgs)

const makeFileCreator = (): FileCreator & {
  create: jest.Mock
  createIfNotExists: jest.Mock
} => ({
  create: jest.fn(),
  createIfNotExists: jest.fn(),
})

describe('generateBackEntityGraph', () => {
  const cards = new CatalogBuilder('cards', 'ru')
  cards.addField('name').setType('string').setRequired()
  const entity = cards.build()

  test("'files' mode (default) writes all 7 per-entity graph files, unchanged", () => {
    const fileCreator = makeFileCreator()

    generateBackEntityGraph(fileCreator, makeArgs(entity, 'files'))

    expect(fileCreator.create).toHaveBeenCalledTimes(5)
    expect(fileCreator.createIfNotExists).toHaveBeenCalledTimes(2)

    const createdPaths = fileCreator.create.mock.calls.map((call) => call[0])
    expect(createdPaths.some((p: string) => p.endsWith('baseTypeDefs.ts'))).toBe(true)
    expect(createdPaths.some((p: string) => p.endsWith('baseResolvers.ts'))).toBe(true)
    expect(createdPaths.some((p: string) => p.endsWith('permissionsToGraphql.ts'))).toBe(true)
    expect(createdPaths.some((p: string) => p.endsWith('basePermissionsToGraphql.ts'))).toBe(true)
    expect(createdPaths.some((p: string) => p.endsWith('additionalPermissionsToGraphql.ts'))).toBe(true)

    const createIfNotExistsPaths = fileCreator.createIfNotExists.mock.calls.map(
      (call) => call[0]
    )
    expect(createIfNotExistsPaths.some((p: string) => p.endsWith('additionalTypeDefs.ts'))).toBe(
      true
    )
    expect(createIfNotExistsPaths.some((p: string) => p.endsWith('additionalResolvers.ts'))).toBe(
      true
    )
  })

  test("'runtime_meta' mode writes no base/permission files, keeps the two additional*.ts stubs", () => {
    const fileCreator = makeFileCreator()

    generateBackEntityGraph(fileCreator, makeArgs(entity, 'runtime_meta'))

    expect(fileCreator.create).not.toHaveBeenCalled()
    expect(fileCreator.createIfNotExists).toHaveBeenCalledTimes(2)

    const createIfNotExistsPaths = fileCreator.createIfNotExists.mock.calls.map(
      (call) => call[0]
    )
    expect(createIfNotExistsPaths.some((p: string) => p.endsWith('additionalTypeDefs.ts'))).toBe(
      true
    )
    expect(createIfNotExistsPaths.some((p: string) => p.endsWith('additionalResolvers.ts'))).toBe(
      true
    )
  })
})
