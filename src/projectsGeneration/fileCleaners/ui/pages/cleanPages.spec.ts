import {expect, jest, afterEach} from 'jest-without-globals'
import {existsSync, mkdirSync, mkdtempSync, writeFileSync} from 'fs'
import {tmpdir} from 'os'
import {dirname, join} from 'path'
import SystemMetaBuilder from '../../../builders/SystemMetaBuilder'
import {prepareProjectWideGenerationArgs} from '../../../args'
import {BootstrapEntityOptions, defaultBootstrapEntityOptions} from '../../../types'
import {generatedWarning} from '../../../utils'
import {GenerationPathCategory} from '../../../builders/generationPaths'
import log from '../../../../log'
import cleanPages from './cleanPages'

// yarn test --testPathPattern cleanPages

const generated = (body: string) => `/* eslint-disable */\n//\n// ${generatedWarning}\n//\n\n${body}`

const createRoot = () => mkdtempSync(join(tmpdir(), 'runlify-clean-pages-'))

const writeUiFile = (root: string, relativePath: string, content: string) => {
  const fullPath = join(root, relativePath)
  mkdirSync(dirname(fullPath), {recursive: true})
  writeFileSync(fullPath, content)

  return fullPath
}

const prepareArgs = (root: string, options: Partial<BootstrapEntityOptions> = {}) => {
  const system = new SystemMetaBuilder('test')

  const accountLevels = system.addCatalog('accountLevels')
  accountLevels.addField('title').setType('string')
  accountLevels.getForms().setUiPagesMode('descriptor')

  system.addCatalog('cities').addField('title').setType('string')

  mkdirSync(join(root, 'src/adm/pages'), {recursive: true})

  return prepareProjectWideGenerationArgs(system.build(), {
    ...defaultBootstrapEntityOptions,
    detachedBackProject: join(root, 'back'),
    detachedUiProject: root,
    ...options,
  })
}

const spyOnLog = () => ({
  warn: jest.spyOn(log, 'warn').mockImplementation((() => undefined) as never),
  info: jest.spyOn(log, 'info').mockImplementation((() => undefined) as never),
})

afterEach(() => {
  jest.restoreAllMocks()
})

describe('cleanPages', () => {
  test('removes legacy list/show files of a descriptor entity', () => {
    const root = createRoot()
    const args = prepareArgs(root)
    spyOnLog()

    const legacyFiles = [
      'src/adm/pages/accountLevels/AccountLevelList/DefaultAccountLevelList.tsx',
      'src/adm/pages/accountLevels/AccountLevelList/DefaultAccountLevelFilter.tsx',
      'src/adm/pages/accountLevels/AccountLevelShow/DefaultAccountLevelShow.tsx',
      'src/adm/pages/accountLevels/AccountLevelShow/DefaultMainTab.tsx',
      'src/adm/pages/accountLevels/AccountLevelShow/DefaultActions.tsx',
      'src/adm/pages/accountLevels/AccountLevelShow/tabs/MdProfilesAccountLevelIdTab.tsx',
    ].map((path) => writeUiFile(root, path, generated('export default null;')))

    const keptFiles = [
      'src/adm/pages/accountLevels/AccountLevelList/index.tsx',
      'src/adm/pages/accountLevels/AccountLevelList/AccountLevelFilter.tsx',
      'src/adm/pages/accountLevels/AccountLevelShow/MainTab.tsx',
      'src/adm/pages/accountLevels/AccountLevelDescriptor.ts',
    ].map((path) => writeUiFile(root, path, 'export default null;'))

    cleanPages(args)

    legacyFiles.forEach((path) => expect(existsSync(path)).toBe(false))
    keptFiles.forEach((path) => expect(existsSync(path)).toBe(true))
    expect(existsSync(join(root, 'src/adm/pages/accountLevels/AccountLevelShow/tabs'))).toBe(false)
  })

  test('removes legacy create/edit/validation files of a descriptor entity', () => {
    const root = createRoot()
    const args = prepareArgs(root)
    spyOnLog()

    const legacyFiles = [
      'src/adm/pages/accountLevels/AccountLevelCreate/DefaultAccountLevelCreate.tsx',
      'src/adm/pages/accountLevels/AccountLevelEdit/DefaultAccountLevelEdit.tsx',
      'src/adm/pages/accountLevels/getAccountLevelValidation.tsx',
    ].map((path) => writeUiFile(root, path, generated('export default null;')))

    const keptFiles = [
      'src/adm/pages/accountLevels/AccountLevelCreate/index.tsx',
      'src/adm/pages/accountLevels/AccountLevelEdit/index.tsx',
    ].map((path) => writeUiFile(root, path, 'export default null;'))

    cleanPages(args)

    legacyFiles.forEach((path) => expect(existsSync(path)).toBe(false))
    keptFiles.forEach((path) => expect(existsSync(path)).toBe(true))
  })

  test('keeps legacy files of a descriptor entity without the generated marker and warns', () => {
    const root = createRoot()
    const args = prepareArgs(root)
    const {warn} = spyOnLog()

    const handwrittenLegacy = [
      'src/adm/pages/accountLevels/AccountLevelCreate/DefaultAccountLevelCreate.tsx',
      'src/adm/pages/accountLevels/AccountLevelEdit/DefaultAccountLevelEdit.tsx',
      'src/adm/pages/accountLevels/AccountLevelList/DefaultAccountLevelList.tsx',
      'src/adm/pages/accountLevels/getAccountLevelValidation.tsx',
    ].map((path) => writeUiFile(root, path, 'export default null;'))

    cleanPages(args)

    handwrittenLegacy.forEach((path) => expect(existsSync(path)).toBe(true))
    expect(warn).toHaveBeenCalledWith(
      expect.stringContaining('has no generated-file marker, left in place'),
    )
  })

  test('keeps handwritten files in the tabs folder', () => {
    const root = createRoot()
    const args = prepareArgs(root)
    spyOnLog()

    const handwritten = writeUiFile(
      root,
      'src/adm/pages/accountLevels/AccountLevelShow/tabs/CustomTab.tsx',
      'export default null;',
    )
    const tab = writeUiFile(
      root,
      'src/adm/pages/accountLevels/AccountLevelShow/tabs/MdProfilesAccountLevelIdTab.tsx',
      generated('export default null;'),
    )

    cleanPages(args)

    expect(existsSync(tab)).toBe(false)
    expect(existsSync(handwritten)).toBe(true)
  })

  test('removes the descriptor of a legacy entity', () => {
    const root = createRoot()
    const args = prepareArgs(root)
    spyOnLog()

    const descriptor = writeUiFile(
      root,
      'src/adm/pages/cities/CityDescriptor.ts',
      generated('export const cityData = {};'),
    )
    const handwritten = writeUiFile(
      root,
      'src/adm/pages/cities/CityList/index.tsx',
      'export default null;',
    )

    cleanPages(args)

    expect(existsSync(descriptor)).toBe(false)
    expect(existsSync(handwritten)).toBe(true)
  })

  test('removes entity icons only when genUiEntityIcons is off', () => {
    const root = createRoot()
    spyOnLog()

    const icon = writeUiFile(
      root,
      'src/adm/pages/cities/CityIcon.tsx',
      generated('export default null;'),
    )
    const handwrittenIcon = writeUiFile(
      root,
      'src/adm/pages/accountLevels/AccountLevelIcon.tsx',
      'export default null;',
    )

    cleanPages(prepareArgs(root))

    expect(existsSync(icon)).toBe(true)

    cleanPages(prepareArgs(root, {genUiEntityIcons: false}))

    expect(existsSync(icon)).toBe(false)
    expect(existsSync(handwrittenIcon)).toBe(true)
  })

  test('prune removes an orphan folder with runlify files only', () => {
    const root = createRoot()
    const args = prepareArgs(root, {pruneOrphanPages: true})
    spyOnLog()

    writeUiFile(
      root,
      'src/adm/pages/oldCards/OldCardList/DefaultOldCardList.tsx',
      generated('export default null;'),
    )
    writeUiFile(root, 'src/adm/pages/oldCards/OldCardList/index.tsx', 'export default null;')
    writeUiFile(root, 'src/adm/pages/oldCards/OldCardList/OldCardFilter.tsx', 'export default null;')
    writeUiFile(root, 'src/adm/pages/oldCards/OldCardShow/MainTab.tsx', 'export default null;')

    cleanPages(args)

    expect(existsSync(join(root, 'src/adm/pages/oldCards'))).toBe(false)
  })

  test('prune keeps an orphan folder with handwritten files and warns', () => {
    const root = createRoot()
    const args = prepareArgs(root, {pruneOrphanPages: true})
    const {warn} = spyOnLog()

    const generatedFile = writeUiFile(
      root,
      'src/adm/pages/oldCards/OldCardList/DefaultOldCardList.tsx',
      generated('export default null;'),
    )
    const stub = writeUiFile(
      root,
      'src/adm/pages/oldCards/OldCardList/index.tsx',
      'export default null;',
    )
    const handwritten = writeUiFile(
      root,
      'src/adm/pages/oldCards/OldCardList/CustomOldCardList.tsx',
      'export default null;',
    )

    cleanPages(args)

    expect(existsSync(generatedFile)).toBe(false)
    expect(existsSync(stub)).toBe(true)
    expect(existsSync(handwritten)).toBe(true)
    expect(warn).toHaveBeenCalledWith(expect.stringContaining('OldCardList/CustomOldCardList.tsx'))
  })

  test('prune dry run removes nothing', () => {
    const root = createRoot()
    const args = prepareArgs(root, {pruneOrphanPages: true, pruneDryRun: true})
    const {info} = spyOnLog()

    const generatedFile = writeUiFile(
      root,
      'src/adm/pages/oldCards/OldCardList/DefaultOldCardList.tsx',
      generated('export default null;'),
    )
    const stub = writeUiFile(
      root,
      'src/adm/pages/oldCards/OldCardList/index.tsx',
      'export default null;',
    )

    cleanPages(args)

    expect(existsSync(generatedFile)).toBe(true)
    expect(existsSync(stub)).toBe(true)
    expect(info).toHaveBeenCalledWith(expect.stringContaining('would remove'))
  })

  test('without prune an orphan folder is only reported', () => {
    const root = createRoot()
    const args = prepareArgs(root)
    const {warn} = spyOnLog()

    const generatedFile = writeUiFile(
      root,
      'src/adm/pages/oldCards/OldCardList/DefaultOldCardList.tsx',
      generated('export default null;'),
    )

    cleanPages(args)

    expect(existsSync(generatedFile)).toBe(true)
    expect(warn).toHaveBeenCalledWith(expect.stringContaining('Entity oldCards not found for pages path'))
  })

  test('skips cleanup when page path templates resolve to different roots', () => {
    const root = createRoot()
    const system = new SystemMetaBuilder('test')

    const accountLevels = system.addCatalog('accountLevels')
    accountLevels.addField('title').setType('string')
    accountLevels.getForms().setUiPagesMode('descriptor')

    system
      .generationPaths()
      .setPath(
        GenerationPathCategory.UiPageDescriptor,
        'src/adm/descriptors/{entityName}/{pascalSingular}Descriptor.ts',
      )

    mkdirSync(join(root, 'src/adm/pages'), {recursive: true})

    const args = prepareProjectWideGenerationArgs(system.build(), {
      ...defaultBootstrapEntityOptions,
      detachedBackProject: join(root, 'back'),
      detachedUiProject: root,
    })
    const {warn} = spyOnLog()

    const legacyFile = writeUiFile(
      root,
      'src/adm/pages/accountLevels/AccountLevelList/DefaultAccountLevelList.tsx',
      generated('export default null;'),
    )

    cleanPages(args)

    expect(existsSync(legacyFile)).toBe(true)
    expect(warn).toHaveBeenCalledWith(
      expect.stringContaining('page path templates resolve to different roots'),
    )
  })

  test('additional service folders are not touched', () => {
    const root = createRoot()
    const system = new SystemMetaBuilder('test')
    system.addCatalog('cities')
    system.addAdditionalService('reportService')

    mkdirSync(join(root, 'src/adm/pages'), {recursive: true})

    const args = prepareProjectWideGenerationArgs(system.build(), {
      ...defaultBootstrapEntityOptions,
      detachedBackProject: join(root, 'back'),
      detachedUiProject: root,
      pruneOrphanPages: true,
    })
    const {warn} = spyOnLog()

    const servicePage = writeUiFile(
      root,
      'src/adm/pages/reportService/index.tsx',
      generated('export default null;'),
    )

    cleanPages(args)

    expect(existsSync(servicePage)).toBe(true)
    expect(warn).not.toHaveBeenCalled()
  })
})
