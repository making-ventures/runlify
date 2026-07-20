import {existsSync, readFileSync} from 'fs'
import {dirname, isAbsolute, join, resolve} from 'path'

/** Режим раскладки. По умолчанию `legacy` — без изменений для aloyal и др. */
export type RunlifyLayoutMode = 'legacy' | 'monorepo'

/**
 * Пути в monorepo-режиме — относительно `repoRoot`.
 */
export interface RunlifyMonorepoPaths {
  root?: string
  back?: string
  ui?: string
  meta?: string
  shared?: string
  sharedSchema?: string
}

export interface RunlifyLocalConfig {
  projectName?: string
  partName?: string
  projectCategory?: string
  scopes?: string[]
  layout?: RunlifyLayoutMode
  monorepo?: boolean
  paths?: RunlifyMonorepoPaths
}

export interface RunlifyResolvedPaths {
  detachedBackProject: string
  detachedUiProject: string
  /** Absolute path to shared package root when paths.shared is set. */
  detachedSharedProject?: string
  metaDir: string
  metadataJsonPath: string
  optionsJsonPath: string
  repoRoot: string
  layoutMode: RunlifyLayoutMode
  sharedSchemaPath?: string
  copySchemaToUi: boolean
}

export interface BootstrapEntityOptionsPathOverrides {
  detachedBackProject?: string
  detachedUiProject?: string
  projectPrefix?: string
  sharedSchemaPath?: string
  copySchemaToUi?: boolean
}

export interface ResolveProjectPathsInput {
  cwd: string
  runlifyConfig: RunlifyLocalConfig | null
  /** Распарсенный options.json; может быть пустым при первом резолве meta. */
  options?: BootstrapEntityOptionsPathOverrides & Record<string, unknown>
}

const getLayoutMode = (config: RunlifyLocalConfig | null): RunlifyLayoutMode => {
  if (config?.layout === 'legacy' || config?.layout === 'monorepo') {
    return config.layout
  }
  if (config?.monorepo === true) {
    return 'monorepo'
  }
  return 'legacy'
}

const resolveMaybeAbsolute = (base: string, pathValue: string): string => {
  if (isAbsolute(pathValue)) {
    return pathValue
  }
  return resolve(base, pathValue)
}

/**
 * Walk up from cwd looking for pnpm-workspace.yaml or package.json with workspaces.
 */
export const detectRepoRoot = (cwd: string, explicitRoot?: string): string => {
  if (explicitRoot) {
    return resolveMaybeAbsolute(cwd, explicitRoot)
  }

  let dir = resolve(cwd)
  for (;;) {
    if (existsSync(join(dir, 'pnpm-workspace.yaml'))) {
      return dir
    }
    const pkgPath = join(dir, 'package.json')
    if (existsSync(pkgPath)) {
      try {
        const pkg = JSON.parse(readFileSync(pkgPath, 'utf8')) as {
          workspaces?: unknown
        }
        if (pkg.workspaces) {
          return dir
        }
      } catch {
        // ignore unreadable package.json
      }
    }
    const parent = dirname(dir)
    if (parent === dir) {
      break
    }
    dir = parent
  }

  // Legacy fallback: parent of cwd (sibling back/ui layout)
  return resolve(cwd, '..')
}

export const detectMetaDir = (repoRoot: string, back: string): string => {
  const rootMeta = join(repoRoot, 'meta')
  if (existsSync(rootMeta)) {
    return rootMeta
  }
  return join(back, 'src', 'meta')
}

const withMetaFiles = (
  partial: Omit<RunlifyResolvedPaths, 'metadataJsonPath' | 'optionsJsonPath'>,
): RunlifyResolvedPaths => ({
  ...partial,
  metadataJsonPath: join(partial.metaDir, 'metadata.json'),
  optionsJsonPath: join(partial.metaDir, 'options.json'),
})

/**
 * Resolve absolute project paths for legacy (sibling repos) and monorepo layouts.
 * Generators keep reading detachedBackProject / detachedUiProject.
 */
export function resolveProjectPaths(
  input: ResolveProjectPathsInput,
): RunlifyResolvedPaths {
  const {cwd, runlifyConfig} = input
  const options = input.options ?? {}
  const layoutMode = getLayoutMode(runlifyConfig)
  const copySchemaToUi = options.copySchemaToUi ?? true
  const projectPrefix =
    (typeof options.projectPrefix === 'string' && options.projectPrefix) ||
    runlifyConfig?.projectName ||
    ''

  if (layoutMode === 'legacy') {
    const repoRoot = resolve(cwd, '..')
    const backName =
      options.detachedBackProject || `${projectPrefix}-back`
    const uiName = options.detachedUiProject || `${projectPrefix}-ui`
    const detachedBackProject = resolveMaybeAbsolute(repoRoot, backName)
    const detachedUiProject = resolveMaybeAbsolute(repoRoot, uiName)
    const metaDir = join(cwd, 'src', 'meta')

    return withMetaFiles({
      layoutMode,
      repoRoot,
      detachedBackProject,
      detachedUiProject,
      metaDir,
      copySchemaToUi,
      sharedSchemaPath: options.sharedSchemaPath,
    })
  }

  // monorepo
  const repoRoot = detectRepoRoot(cwd, runlifyConfig?.paths?.root)
  const paths = runlifyConfig?.paths ?? {}

  const back = paths.back
    ? resolveMaybeAbsolute(repoRoot, paths.back)
    : resolve(cwd)

  const ui = paths.ui
    ? resolveMaybeAbsolute(repoRoot, paths.ui)
    : resolve(repoRoot, '..', `${projectPrefix}-ui`)

  // Escape hatch: non-empty detached* in monorepo treated relative to repoRoot
  // (or absolute). Only when paths.back / paths.ui not set — paths win.
  const detachedBackProject = paths.back
    ? back
    : options.detachedBackProject
      ? resolveMaybeAbsolute(repoRoot, options.detachedBackProject)
      : back

  const detachedUiProject = paths.ui
    ? ui
    : options.detachedUiProject
      ? resolveMaybeAbsolute(repoRoot, options.detachedUiProject)
      : ui

  const metaDir = paths.meta
    ? resolveMaybeAbsolute(repoRoot, paths.meta)
    : detectMetaDir(repoRoot, detachedBackProject)

  const detachedSharedProject = paths.shared
    ? resolveMaybeAbsolute(repoRoot, paths.shared)
    : undefined

  let sharedSchemaPath = options.sharedSchemaPath
  if (!sharedSchemaPath && paths.sharedSchema) {
    sharedSchemaPath = resolveMaybeAbsolute(repoRoot, paths.sharedSchema)
  } else if (!sharedSchemaPath && paths.shared) {
    sharedSchemaPath = join(
      resolveMaybeAbsolute(repoRoot, paths.shared),
      'src',
      'graphql.schema.json',
    )
  }

  return withMetaFiles({
    layoutMode,
    repoRoot,
    detachedBackProject,
    detachedUiProject,
    detachedSharedProject,
    metaDir,
    copySchemaToUi,
    sharedSchemaPath,
  })
}

/**
 * Resolve only meta/options locations (before options.json is read).
 * Uses empty options; monorepo meta comes from runlify.json paths.
 */
export function resolveMetaPaths(
  cwd: string,
  runlifyConfig: RunlifyLocalConfig | null,
): Pick<
  RunlifyResolvedPaths,
  'metaDir' | 'metadataJsonPath' | 'optionsJsonPath' | 'layoutMode' | 'repoRoot'
> {
  const resolved = resolveProjectPaths({cwd, runlifyConfig, options: {}})
  return {
    metaDir: resolved.metaDir,
    metadataJsonPath: resolved.metadataJsonPath,
    optionsJsonPath: resolved.optionsJsonPath,
    layoutMode: resolved.layoutMode,
    repoRoot: resolved.repoRoot,
  }
}
