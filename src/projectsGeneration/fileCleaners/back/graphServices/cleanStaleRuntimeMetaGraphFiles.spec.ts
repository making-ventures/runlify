import {expect} from 'jest-without-globals'
import {mkdtempSync, mkdirSync, writeFileSync, existsSync, rmSync} from 'fs'
import {tmpdir} from 'os'
import {join} from 'path'
import {ProjectWideGenerationArgs} from '../../../args'
import {defaultBootstrapEntityOptions} from '../../../types'
import cleanStaleRuntimeMetaGraphFiles from './cleanStaleRuntimeMetaGraphFiles'

// yarn test --testPathPattern cleanStaleRuntimeMetaGraphFiles

const STALE_FILES = [
  'baseTypeDefs.ts',
  'baseResolvers.ts',
  'basePermissionsToGraphql.ts',
  'permissionsToGraphql.ts',
  'additionalPermissionsToGraphql.ts',
]
const SURVIVING_FILES = ['additionalTypeDefs.ts', 'additionalResolvers.ts']

const makeArgsWithEntityGraphFiles = (
  detachedBackProject: string,
  entityName: string,
  graphSchemaMode: 'files' | 'runtime_meta'
) => {
  const entityDir = join(detachedBackProject, 'src/adm/graph/services', entityName)
  mkdirSync(entityDir, {recursive: true})
  STALE_FILES.forEach((file) => writeFileSync(join(entityDir, file), '// stale'))
  SURVIVING_FILES.forEach((file) => writeFileSync(join(entityDir, file), '// keep'))

  const args = {
    entities: [{name: entityName}],
    options: {
      ...defaultBootstrapEntityOptions,
      detachedBackProject,
      detachedUiProject: detachedBackProject,
      graphSchemaMode,
    },
    system: {generationPaths: null},
  } as unknown as ProjectWideGenerationArgs

  return {entityDir, args}
}

describe('cleanStaleRuntimeMetaGraphFiles', () => {
  let tmpRoot: string

  beforeEach(() => {
    tmpRoot = mkdtempSync(join(tmpdir(), 'runlify-clean-stale-'))
  })

  afterEach(() => {
    rmSync(tmpRoot, {recursive: true, force: true})
  })

  test("'runtime_meta': deletes the 5 stale files, keeps the two additional*.ts stubs", () => {
    const {entityDir, args} = makeArgsWithEntityGraphFiles(tmpRoot, 'cards', 'runtime_meta')

    cleanStaleRuntimeMetaGraphFiles(args)

    STALE_FILES.forEach((file) => {
      expect(existsSync(join(entityDir, file))).toBe(false)
    })
    SURVIVING_FILES.forEach((file) => {
      expect(existsSync(join(entityDir, file))).toBe(true)
    })
  })

  test("'files' mode: no-op, nothing deleted", () => {
    const {entityDir, args} = makeArgsWithEntityGraphFiles(tmpRoot, 'cards', 'files')

    cleanStaleRuntimeMetaGraphFiles(args)

    STALE_FILES.forEach((file) => {
      expect(existsSync(join(entityDir, file))).toBe(true)
    })
  })

  test("'runtime_meta': already-clean entity directory doesn't throw", () => {
    const entityDir = join(tmpRoot, 'src/adm/graph/services/cards')
    mkdirSync(entityDir, {recursive: true})
    const args = {
      entities: [{name: 'cards'}],
      options: {
        ...defaultBootstrapEntityOptions,
        detachedBackProject: tmpRoot,
        detachedUiProject: tmpRoot,
        graphSchemaMode: 'runtime_meta',
      },
      system: {generationPaths: null},
    } as unknown as ProjectWideGenerationArgs

    expect(() => cleanStaleRuntimeMetaGraphFiles(args)).not.toThrow()
  })
})
