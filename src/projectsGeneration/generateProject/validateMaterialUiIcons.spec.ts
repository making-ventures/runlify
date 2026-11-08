import {afterEach, describe, expect, it} from 'jest-without-globals'
import {mkdirSync, writeFileSync} from 'fs'
import {join} from 'path'
import {tmpdir} from 'os'
import {remove} from 'fs-jetpack'
import {MenuItem, MenuItemType} from '../builders/buildedTypes'
import {ProjectWideGenerationArgs} from '../args'
import {
  checkMaterialUiIcons,
  collectMaterialUiIcons,
  formatInvalidMaterialUiIcons,
} from './validateMaterialUiIcons'

/**
 * Shaped like a real @mui/icons-material 7.x / 9.x install: a `"./*"` wildcard export,
 * `index.js` and an `esm/` folder next to the icon modules.
 */
const mkUiProject = (icons?: string[], version = '9.4.0'): string => {
  const dir = join(tmpdir(), `runlify-mui-icons-${Date.now()}-${Math.random()}`)
  mkdirSync(dir, {recursive: true})
  if (icons) {
    const pkgDir = join(dir, 'node_modules', '@mui', 'icons-material')
    mkdirSync(join(pkgDir, 'esm'), {recursive: true})
    writeFileSync(join(pkgDir, 'package.json'), JSON.stringify({
      name: '@mui/icons-material',
      version,
      exports: {
        './package.json': './package.json',
        '.': {require: './index.js', default: './esm/index.js'},
        './*': {require: './*.js', default: './esm/*.js'},
      },
    }))
    for (const file of ['index', ...icons]) {
      writeFileSync(join(pkgDir, `${file}.js`), 'module.exports = {}')
      writeFileSync(join(pkgDir, 'esm', `${file}.js`), 'export default {}')
    }
  }
  return dir
}

const menuItem = (name: string, icon: string, items?: MenuItem[]): MenuItem => ({
  name,
  label: name,
  materialUiIcon: icon,
  title: {},
  needFor: {},
  previewFeatures: [],
  type: 'menuItem',
  debugOnly: false,
  permissions: [],
  ...(items
    ? {itemType: MenuItemType.Group, items}
    : {itemType: MenuItemType.External, link: '/'}),
}) as MenuItem

const mkArgs = (
  entities: Array<{type: string; name: string; materialUiIcon: string}>,
  menuItems: MenuItem[] = [],
) => ({entities, system: {menuItems}}) as unknown as Pick<ProjectWideGenerationArgs, 'entities' | 'system'>

describe('validateMaterialUiIcons', () => {
  const dirs: string[] = []
  const track = (dir: string) => {
    dirs.push(dir)
    return dir
  }

  afterEach(() => {
    for (const dir of dirs) {
      remove(dir)
    }
    dirs.length = 0
  })

  it('collects entity, nested menu and built-in icons with their origin', () => {
    const usages = collectMaterialUiIcons(mkArgs(
      [{type: 'catalog', name: 'users', materialUiIcon: 'People'}],
      [menuItem('Reports', 'Assessment', [menuItem('Sales', 'PieChartOutline')])],
    ))

    expect(usages).toEqual([
      {icon: 'People', where: 'catalog "users"'},
      {icon: 'Assessment', where: 'menu item "Reports"'},
      {icon: 'PieChartOutline', where: 'menu item "Reports / Sales"'},
      {icon: 'DetailsOutlined', where: 'built-in icon'},
      {icon: 'SendOutlined', where: 'built-in icon'},
    ])
  })

  it('is skipped when @mui/icons-material is not installed in the UI project', () => {
    const dir = track(mkUiProject())

    expect(checkMaterialUiIcons([{icon: 'Whatever', where: 'catalog "x"'}], dir)).toEqual({status: 'skipped'})
  })

  it('passes when every icon exists', () => {
    const dir = track(mkUiProject(['People', 'DetailsOutlined']))

    expect(checkMaterialUiIcons([
      {icon: 'People', where: 'catalog "users"'},
      {icon: 'DetailsOutlined', where: 'built-in icon'},
    ], dir)).toEqual({status: 'ok', version: '9.4.0'})
  })

  it('finds the package hoisted to a parent folder (monorepo root)', () => {
    const root = track(mkUiProject(['People']))
    const uiDir = join(root, 'apps', 'ui')
    mkdirSync(uiDir, {recursive: true})

    expect(checkMaterialUiIcons([{icon: 'People', where: 'catalog "users"'}], uiDir))
      .toEqual({status: 'ok', version: '9.4.0'})
  })

  it('compares names exactly, even where the file system ignores case', () => {
    const dir = track(mkUiProject(['HelpOutlined']))
    const result = checkMaterialUiIcons([
      {icon: 'HELPOUTLINED', where: 'catalog "a"'},
      {icon: 'Helpoutlined', where: 'catalog "b"'},
      {icon: 'Index', where: 'catalog "c"'},
    ], dir)

    expect(result).toEqual({
      status: 'invalid',
      version: '9.4.0',
      invalid: [
        {icon: 'HELPOUTLINED', where: 'catalog "a"'},
        {icon: 'Helpoutlined', where: 'catalog "b"'},
        {icon: 'Index', where: 'catalog "c"'},
      ],
    })
  })

  it('reports every unknown icon and suggests the …Outlined replacement', () => {
    const dir = track(mkUiProject(['HelpOutlined']))
    const result = checkMaterialUiIcons([
      {icon: 'HelpOutline', where: 'catalog "users"'},
      {icon: 'Hepl', where: 'menu item "Help"'},
    ], dir)

    expect(result).toEqual({
      status: 'invalid',
      version: '9.4.0',
      invalid: [
        {icon: 'HelpOutline', where: 'catalog "users"', suggestion: 'HelpOutlined'},
        {icon: 'Hepl', where: 'menu item "Help"'},
      ],
    })

    const message = formatInvalidMaterialUiIcons(result as Extract<typeof result, {status: 'invalid'}>, dir)
    expect(message).toContain('@mui/icons-material 9.4.0')
    expect(message).toContain('  - catalog "users": "HelpOutline" (did you mean "HelpOutlined"?)')
    expect(message).toContain('  - menu item "Help": "Hepl"')
  })
})
