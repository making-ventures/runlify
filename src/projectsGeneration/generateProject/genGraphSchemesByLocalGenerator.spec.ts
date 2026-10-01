import {expect} from 'jest-without-globals'
import * as os from 'os'
import * as path from 'path'
import fs from 'fs-extra'
import {genGraphSchemesByLocalGenerator} from './genGraphSchemesByLocalGenerator'

describe('genGraphSchemesByLocalGenerator', () => {
  it('does not fail when the command exits 0 but writes to stderr', async () => {
    await expect(
      genGraphSchemesByLocalGenerator({
        graphGeneratorCommand: 'node -e "console.error(\'benign warning\'); process.exit(0)"',
        detachedBackProject: __dirname,
        detachedUiProject: __dirname,
        genFrontend: false,
      } as never),
    ).resolves.toBeUndefined()
  })

  it('still fails when the command exits non-zero', async () => {
    await expect(
      genGraphSchemesByLocalGenerator({
        graphGeneratorCommand: 'node -e "process.exit(1)"',
        detachedBackProject: __dirname,
        detachedUiProject: __dirname,
        genFrontend: false,
      } as never),
    ).rejects.toThrow()
  })


  describe('copying to ui', () => {
    let root: string
    let back: string
    let ui: string

    const run = (extra: Record<string, unknown>) =>
      genGraphSchemesByLocalGenerator({
        graphGeneratorCommand: 'node -e "process.exit(0)"',
        detachedBackProject: back,
        detachedUiProject: ui,
        genFrontend: true,
        ...extra,
      } as never)

    const uiTs = () => path.join(ui, 'src', 'generated', 'graphql.ts')
    const uiSchema = () => path.join(ui, 'src', 'generated', 'graphql.schema.json')

    beforeEach(async () => {
      root = await fs.mkdtemp(path.join(os.tmpdir(), 'runlify-gql-'))
      back = path.join(root, 'back')
      ui = path.join(root, 'ui')
      await fs.outputFile(path.join(back, 'src', 'generated', 'graphql.ts'), 'ts')
      await fs.outputFile(path.join(back, 'src', 'generated', 'graphql.schema.json'), '{}')
      await fs.ensureDir(path.join(ui, 'src', 'generated'))
    })

    afterEach(async () => {
      await fs.remove(root)
    })

    it('copies both files by default', async () => {
      await run({})
      expect(fs.existsSync(uiTs())).toBe(true)
      expect(fs.existsSync(uiSchema())).toBe(true)
    })

    it('copySchemaToUi: false without copyGraphqlTsToUi skips both (old behaviour)', async () => {
      await run({copySchemaToUi: false})
      expect(fs.existsSync(uiTs())).toBe(false)
      expect(fs.existsSync(uiSchema())).toBe(false)
    })

    it('copySchemaToUi: false + copyGraphqlTsToUi: true copies only graphql.ts', async () => {
      await run({copySchemaToUi: false, copyGraphqlTsToUi: true})
      expect(fs.existsSync(uiTs())).toBe(true)
      expect(fs.existsSync(uiSchema())).toBe(false)
    })

    it('copyGraphqlTsToUi: false copies only the schema', async () => {
      await run({copyGraphqlTsToUi: false})
      expect(fs.existsSync(uiTs())).toBe(false)
      expect(fs.existsSync(uiSchema())).toBe(true)
    })

    it('copies the schema to sharedSchemaPath regardless of ui flags', async () => {
      const shared = path.join(root, 'shared', 'src', 'graphql.schema.json')
      await run({copySchemaToUi: false, copyGraphqlTsToUi: true, sharedSchemaPath: shared})
      expect(fs.existsSync(shared)).toBe(true)
      expect(fs.existsSync(uiSchema())).toBe(false)
    })
  })
})
