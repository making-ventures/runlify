import {existsSync, readdirSync, readFileSync} from 'fs'
import {dirname, join, resolve} from 'path'
import {ProjectWideGenerationArgs} from '../args'
import {BUILT_IN_ICONS, flattenMenuItems} from '../generators/fileTemplates/ui/builtInIcons'
import log from '../../log'

const ICONS_PACKAGE = '@mui/icons-material'

/** Icon modules sit at the package root as `<PascalCaseName>.js`; `index.js` and the rest are not icons. */
const ICON_FILE = /^([A-Z][A-Za-z0-9]*)\.js$/u

export type MaterialUiIconUsage = {
  icon: string
  where: string
}

/** Every icon the generated UI will import, with a human-readable place it comes from. */
export const collectMaterialUiIcons = (
  args: Pick<ProjectWideGenerationArgs, 'entities' | 'system'>,
): MaterialUiIconUsage[] => [
  ...args.entities.map((entity) => ({
    icon: entity.materialUiIcon,
    where: `${entity.type} "${entity.name}"`,
  })),
  ...args.system.menuItems
    .flatMap((menuItem) => flattenMenuItems(menuItem))
    .map(({item, path}) => ({icon: item.materialUiIcon, where: `menu item "${path.join(' / ')}"`})),
  ...BUILT_IN_ICONS.map((icon) => ({icon, where: 'built-in icon'})),
]

type InstalledIconsPackage = {
  version: string
  icons: Set<string>
}

/**
 * Finds `node_modules/@mui/icons-material` the way Node resolves it from the UI project
 * (the project itself, then parent folders, e.g. a monorepo root) and lists its icons.
 *
 * Icon names are compared against the file list rather than with require.resolve: the
 * `"./*"` export of MUI 7 and 9.x lets require.resolve match `HELPOUTLINED` or `Index` on
 * case-insensitive file systems (macOS, Windows), which then fail on Linux CI.
 */
const findInstalledIconsPackage = (uiProjectDir: string): InstalledIconsPackage | undefined => {
  for (let dir = resolve(uiProjectDir); ; dir = dirname(dir)) {
    const packageDir = join(dir, 'node_modules', ICONS_PACKAGE)
    if (existsSync(join(packageDir, 'package.json'))) {
      let version = 'unknown'
      try {
        version = JSON.parse(readFileSync(join(packageDir, 'package.json'), 'utf8')).version ?? version
      } catch {
        // ignore unreadable package.json, the icon list is what matters
      }
      const icons = new Set(
        readdirSync(packageDir).flatMap((file) => ICON_FILE.exec(file)?.[1] ?? []),
      )
      return {version, icons}
    }
    if (dirname(dir) === dir) {
      return undefined
    }
  }
}

export type MaterialUiIconsCheckResult =
  | {status: 'skipped'}
  | {status: 'ok'; version: string}
  | {status: 'invalid'; version: string; invalid: Array<MaterialUiIconUsage & {suggestion?: string}>}

/**
 * Checks that every icon exists in the UI project's installed `@mui/icons-material`.
 * Returns `skipped` when the package is not installed there (e.g. fresh clone, no install yet).
 */
export const checkMaterialUiIcons = (
  usages: MaterialUiIconUsage[],
  uiProjectDir: string,
): MaterialUiIconsCheckResult => {
  const installed = findInstalledIconsPackage(uiProjectDir)
  if (!installed) {
    return {status: 'skipped'}
  }

  const {version, icons} = installed
  const invalid = usages
    .filter(({icon}) => !icons.has(icon))
    .map((usage) => {
      // MUI 9 removed the `…Outline` aliases in favour of `…Outlined`.
      const candidate = `${usage.icon}d`
      return usage.icon.endsWith('Outline') && icons.has(candidate)
        ? {...usage, suggestion: candidate}
        : usage
    })

  return invalid.length ? {status: 'invalid', version, invalid} : {status: 'ok', version}
}

export const formatInvalidMaterialUiIcons = (
  result: Extract<MaterialUiIconsCheckResult, {status: 'invalid'}>,
  uiProjectDir: string,
): string => [
  `Unknown Material UI icons (checked against ${ICONS_PACKAGE} ${result.version} installed for ${uiProjectDir}):`,
  ...result.invalid.map(({icon, where, suggestion}) =>
    `  - ${where}: "${icon}"${suggestion ? ` (did you mean "${suggestion}"?)` : ''}`),
  'Fix the names passed to setMaterialUiIcon() in the meta. Available icons: https://mui.com/material-ui/material-icons/',
].join('\n')

/** Throws on unknown icons; only warns when the UI project has no `@mui/icons-material` installed. */
export const validateMaterialUiIcons = (args: ProjectWideGenerationArgs): void => {
  const uiProjectDir = args.options.detachedUiProject
  const result = checkMaterialUiIcons(collectMaterialUiIcons(args), uiProjectDir)

  if (result.status === 'skipped') {
    log.warn(
      `${ICONS_PACKAGE} is not installed for ${uiProjectDir}, Material UI icons were not validated. `
      + 'Install the UI project dependencies; an unknown icon will then fail the UI build.',
    )
    return
  }

  if (result.status === 'invalid') {
    throw new Error(formatInvalidMaterialUiIcons(result, uiProjectDir))
  }
}
