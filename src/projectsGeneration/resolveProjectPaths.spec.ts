import {existsSync, mkdirSync, mkdtempSync, rmSync, writeFileSync} from 'fs'
import {tmpdir} from 'os'
import {join} from 'path'
import {expect} from 'jest-without-globals'
import {
  detectMetaDir,
  detectRepoRoot,
  resolveMetaPaths,
  resolveProjectPaths,
} from './resolveProjectPaths'

// yarn test --testPathPattern resolveProjectPaths

describe('resolveProjectPaths', () => {
  let root: string

  beforeEach(() => {
    root = mkdtempSync(join(tmpdir(), 'runlify-paths-'))
  })

  afterEach(() => {
    rmSync(root, {recursive: true, force: true})
  })

  const writeWorkspace = (repoRoot: string) => {
    writeFileSync(join(repoRoot, 'pnpm-workspace.yaml'), 'packages:\n  - apps/*\n')
  }

  test('legacy: meta under cwd/src/meta, back/ui siblings by projectPrefix', () => {
    const back = join(root, 'aloyal-back')
    mkdirSync(join(back, 'src', 'meta'), {recursive: true})

    const resolved = resolveProjectPaths({
      cwd: back,
      runlifyConfig: {projectName: 'aloyal'},
      options: {projectPrefix: 'aloyal'},
    })

    expect(resolved.layoutMode).toBe('legacy')
    expect(resolved.repoRoot).toBe(root)
    expect(resolved.metaDir).toBe(join(back, 'src', 'meta'))
    expect(resolved.metadataJsonPath).toBe(
      join(back, 'src', 'meta', 'metadata.json'),
    )
    expect(resolved.detachedBackProject).toBe(join(root, 'aloyal-back'))
    expect(resolved.detachedUiProject).toBe(join(root, 'aloyal-ui'))
    expect(resolved.copySchemaToUi).toBe(true)
  })

  test('legacy: explicit detached* names', () => {
    const back = join(root, 'custom-back')
    mkdirSync(back, {recursive: true})

    const resolved = resolveProjectPaths({
      cwd: back,
      runlifyConfig: null,
      options: {
        projectPrefix: 'aloyal',
        detachedBackProject: 'custom-back',
        detachedUiProject: 'custom-ui',
      },
    })

    expect(resolved.detachedBackProject).toBe(join(root, 'custom-back'))
    expect(resolved.detachedUiProject).toBe(join(root, 'custom-ui'))
  })

  test('monorepo: RLW-like paths.meta / back / ui / sharedSchema', () => {
    const repoRoot = join(root, 'rlw')
    const back = join(repoRoot, 'apps', 'back')
    const ui = join(repoRoot, 'apps', 'ui')
    const meta = join(repoRoot, 'meta')
    mkdirSync(back, {recursive: true})
    mkdirSync(ui, {recursive: true})
    mkdirSync(meta, {recursive: true})
    writeWorkspace(repoRoot)

    const resolved = resolveProjectPaths({
      cwd: back,
      runlifyConfig: {
        projectName: 'rlw',
        monorepo: true,
        paths: {
          back: 'apps/back',
          ui: 'apps/ui',
          meta: 'meta',
          shared: 'shared',
          sharedSchema: 'shared/src/graphql.schema.json',
        },
      },
      options: {
        // leftover workaround — paths.* must win
        detachedBackProject: 'back',
        detachedUiProject: 'ui',
      },
    })

    expect(resolved.layoutMode).toBe('monorepo')
    expect(resolved.repoRoot).toBe(repoRoot)
    expect(resolved.detachedBackProject).toBe(back)
    expect(resolved.detachedUiProject).toBe(ui)
    expect(resolved.detachedSharedProject).toBe(join(repoRoot, 'shared'))
    expect(resolved.metaDir).toBe(meta)
    expect(resolved.metadataJsonPath).toBe(join(meta, 'metadata.json'))
    expect(resolved.optionsJsonPath).toBe(join(meta, 'options.json'))
    expect(resolved.sharedSchemaPath).toBe(
      join(repoRoot, 'shared', 'src', 'graphql.schema.json'),
    )
  })

  test('monorepo: layout synonym via layout field', () => {
    const repoRoot = join(root, 'rlw')
    const back = join(repoRoot, 'apps', 'back')
    mkdirSync(back, {recursive: true})
    writeWorkspace(repoRoot)

    const resolved = resolveProjectPaths({
      cwd: back,
      runlifyConfig: {
        layout: 'monorepo',
        paths: {back: 'apps/back', ui: 'apps/ui', meta: 'meta'},
      },
      options: {},
    })

    expect(resolved.layoutMode).toBe('monorepo')
    expect(resolved.detachedBackProject).toBe(back)
  })

  test('monorepo: default meta is repoRoot/meta when it exists', () => {
    const repoRoot = join(root, 'rlw')
    const back = join(repoRoot, 'apps', 'back')
    const meta = join(repoRoot, 'meta')
    mkdirSync(back, {recursive: true})
    mkdirSync(meta, {recursive: true})
    writeWorkspace(repoRoot)

    expect(detectMetaDir(repoRoot, back)).toBe(meta)

    const resolved = resolveProjectPaths({
      cwd: back,
      runlifyConfig: {
        monorepo: true,
        paths: {back: 'apps/back', ui: 'apps/ui'},
      },
      options: {},
    })

    expect(resolved.metaDir).toBe(meta)
  })

  test('monorepo: fallback meta is back/src/meta when no root meta', () => {
    const repoRoot = join(root, 'rlw')
    const back = join(repoRoot, 'apps', 'back')
    mkdirSync(join(back, 'src', 'meta'), {recursive: true})
    writeWorkspace(repoRoot)

    expect(detectMetaDir(repoRoot, back)).toBe(join(back, 'src', 'meta'))

    const resolved = resolveProjectPaths({
      cwd: back,
      runlifyConfig: {
        monorepo: true,
        paths: {back: 'apps/back', ui: 'apps/ui'},
      },
      options: {},
    })

    expect(resolved.metaDir).toBe(join(back, 'src', 'meta'))
  })

  test('monorepo escape hatch: detached* relative to repoRoot when paths.back/ui omitted', () => {
    const repoRoot = join(root, 'rlw')
    const back = join(repoRoot, 'apps', 'back')
    mkdirSync(back, {recursive: true})
    writeWorkspace(repoRoot)

    const resolved = resolveProjectPaths({
      cwd: back,
      runlifyConfig: {monorepo: true, paths: {meta: 'meta'}},
      options: {
        detachedBackProject: 'apps/back',
        detachedUiProject: 'apps/ui',
      },
    })

    expect(resolved.detachedBackProject).toBe(back)
    expect(resolved.detachedUiProject).toBe(join(repoRoot, 'apps', 'ui'))
  })

  test('resolveMetaPaths works before options.json is loaded', () => {
    const repoRoot = join(root, 'rlw')
    const back = join(repoRoot, 'apps', 'back')
    const meta = join(repoRoot, 'meta')
    mkdirSync(back, {recursive: true})
    mkdirSync(meta, {recursive: true})
    writeWorkspace(repoRoot)

    const metaPaths = resolveMetaPaths(back, {
      monorepo: true,
      paths: {back: 'apps/back', ui: 'apps/ui', meta: 'meta'},
    })

    expect(metaPaths.metaDir).toBe(meta)
    expect(metaPaths.optionsJsonPath).toBe(join(meta, 'options.json'))
  })

  test('detectRepoRoot finds pnpm-workspace.yaml', () => {
    const repoRoot = join(root, 'rlw')
    const back = join(repoRoot, 'apps', 'back')
    mkdirSync(back, {recursive: true})
    writeWorkspace(repoRoot)

    expect(detectRepoRoot(back)).toBe(repoRoot)
    expect(existsSync(join(detectRepoRoot(back), 'pnpm-workspace.yaml'))).toBe(
      true,
    )
  })

  test('shared path alone implies sharedSchema default', () => {
    const repoRoot = join(root, 'rlw')
    const back = join(repoRoot, 'apps', 'back')
    mkdirSync(back, {recursive: true})
    writeWorkspace(repoRoot)

    const resolved = resolveProjectPaths({
      cwd: back,
      runlifyConfig: {
        monorepo: true,
        paths: {back: 'apps/back', ui: 'apps/ui', shared: 'shared'},
      },
      options: {},
    })

    expect(resolved.sharedSchemaPath).toBe(
      join(repoRoot, 'shared', 'src', 'graphql.schema.json'),
    )
  })
})
