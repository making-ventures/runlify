import {expect} from 'jest-without-globals'
import SystemMetaBuilder from '../../../builders/SystemMetaBuilder'
import {
  prepareEntityWideGenerationArgs,
  prepareProjectWideGenerationArgs,
} from '../../../args'
import {defaultBootstrapEntityOptions} from '../../../types'
import {FileCreator} from '../../types'
import generateFrontSrcEntityPages from './generateFrontSrcEntityPages'

// yarn test --testPathPattern generateFrontSrcEntityPages

const uiProject = '/ui'

const createFakeFileCreator = () => {
  const created: string[] = []
  const createdIfNotExists: string[] = []

  const toRelative = (path: string) => path.slice(`${uiProject}/`.length)

  const fileCreator: FileCreator = {
    create: (path) => {
      created.push(toRelative(path))
    },
    createIfNotExists: (path) => {
      createdIfNotExists.push(toRelative(path))
    },
  }

  return {fileCreator, created, createdIfNotExists}
}

const generateFor = (entityName: string, uiPagesMode: 'legacy' | 'descriptor') => {
  const system = new SystemMetaBuilder('test')

  const cities = system.addCatalog('cities')
  cities.addField('title').setType('string')

  const accountLevels = system.addCatalog('accountLevels')
  accountLevels.addField('title').setType('string')
  accountLevels.addLinkField('cities', 'cityId')

  const profiles = system.addCatalog('mdProfiles')
  profiles.addLinkField('accountLevels', 'accountLevelId')

  if (uiPagesMode === 'descriptor') {
    system.getCatalogByName(entityName).getForms().setUiPagesMode(uiPagesMode)
  }

  const projectArgs = prepareProjectWideGenerationArgs(system.build(), {
    ...defaultBootstrapEntityOptions,
    detachedBackProject: '/back',
    detachedUiProject: uiProject,
  })
  const {fileCreator, created, createdIfNotExists} = createFakeFileCreator()

  generateFrontSrcEntityPages(
    fileCreator,
    prepareEntityWideGenerationArgs(projectArgs, projectArgs.allEntities.get(entityName)!),
  )

  return {created, createdIfNotExists}
}

describe('generateFrontSrcEntityPages', () => {
  test('legacy mode generates the same set of files as before', () => {
    const {created, createdIfNotExists} = generateFor('accountLevels', 'legacy')

    expect(created.sort()).toEqual([
      'src/adm/pages/accountLevels/AccountLevelCreate/DefaultAccountLevelCreate.tsx',
      'src/adm/pages/accountLevels/AccountLevelEdit/DefaultAccountLevelEdit.tsx',
      'src/adm/pages/accountLevels/AccountLevelList/DefaultAccountLevelFilter.tsx',
      'src/adm/pages/accountLevels/AccountLevelList/DefaultAccountLevelList.tsx',
      'src/adm/pages/accountLevels/AccountLevelShow/DefaultAccountLevelShow.tsx',
      'src/adm/pages/accountLevels/AccountLevelShow/DefaultActions.tsx',
      'src/adm/pages/accountLevels/AccountLevelShow/DefaultMainTab.tsx',
      'src/adm/pages/accountLevels/AccountLevelShow/tabs/MdProfilesAccountLevelIdTab.tsx',
    ].sort())

    expect(createdIfNotExists.sort()).toEqual([
      'src/adm/pages/accountLevels/AccountLevelCreate/index.tsx',
      'src/adm/pages/accountLevels/AccountLevelEdit/index.tsx',
      'src/adm/pages/accountLevels/AccountLevelList/AccountLevelFilter.tsx',
      'src/adm/pages/accountLevels/AccountLevelList/AccountLevelListBreadcrumbs.tsx',
      'src/adm/pages/accountLevels/AccountLevelList/index.tsx',
      'src/adm/pages/accountLevels/AccountLevelShow/MainTab.tsx',
      'src/adm/pages/accountLevels/AccountLevelShow/additionalTabs.tsx',
      'src/adm/pages/accountLevels/AccountLevelShow/index.tsx',
    ].sort())
  })

  test('descriptor mode generates the descriptor, two indexes and create/edit pages', () => {
    const {created, createdIfNotExists} = generateFor('accountLevels', 'descriptor')

    expect(created.sort()).toEqual([
      'src/adm/pages/accountLevels/AccountLevelCreate/DefaultAccountLevelCreate.tsx',
      'src/adm/pages/accountLevels/AccountLevelDescriptor.ts',
      'src/adm/pages/accountLevels/AccountLevelEdit/DefaultAccountLevelEdit.tsx',
    ].sort())

    expect(createdIfNotExists.sort()).toEqual([
      'src/adm/pages/accountLevels/AccountLevelCreate/index.tsx',
      'src/adm/pages/accountLevels/AccountLevelEdit/index.tsx',
      'src/adm/pages/accountLevels/AccountLevelList/index.tsx',
      'src/adm/pages/accountLevels/AccountLevelShow/index.tsx',
    ].sort())
  })

  test('descriptor mode generates no legacy list/show files', () => {
    const {created, createdIfNotExists} = generateFor('accountLevels', 'descriptor')
    const all = [...created, ...createdIfNotExists]

    const listAndShow = all.filter(
      (path) => path.includes('AccountLevelList/') || path.includes('AccountLevelShow/'),
    )

    expect(listAndShow.filter((path) => path.includes('/Default'))).toEqual([])
    expect(all.filter((path) => path.includes('/tabs/'))).toEqual([])
    expect(all.filter((path) => path.includes('MainTab'))).toEqual([])
    expect(all.filter((path) => path.includes('additionalTabs'))).toEqual([])
    expect(all.filter((path) => path.includes('Filter'))).toEqual([])
    expect(all.filter((path) => path.includes('Breadcrumbs'))).toEqual([])
  })

  test('the mode of one entity does not change the files of another one', () => {
    const descriptorModeOther = generateFor('accountLevels', 'descriptor')
    const legacyOther = generateFor('cities', 'legacy')

    expect(descriptorModeOther.created).not.toEqual(legacyOther.created)
    expect(legacyOther.created.sort()).toEqual([
      'src/adm/pages/cities/CityCreate/DefaultCityCreate.tsx',
      'src/adm/pages/cities/CityEdit/DefaultCityEdit.tsx',
      'src/adm/pages/cities/CityList/DefaultCityFilter.tsx',
      'src/adm/pages/cities/CityList/DefaultCityList.tsx',
      'src/adm/pages/cities/CityShow/DefaultActions.tsx',
      'src/adm/pages/cities/CityShow/DefaultCityShow.tsx',
      'src/adm/pages/cities/CityShow/DefaultMainTab.tsx',
      'src/adm/pages/cities/CityShow/tabs/AccountLevelsCityIdTab.tsx',
    ].sort())
  })

  test('typesOnly generates nothing', () => {
    const system = new SystemMetaBuilder('test')
    system.addCatalog('cities').getForms().setUiPagesMode('descriptor')

    const projectArgs = prepareProjectWideGenerationArgs(system.build(), {
      ...defaultBootstrapEntityOptions,
      detachedBackProject: '/back',
      detachedUiProject: uiProject,
      typesOnly: true,
    })
    const {fileCreator, created, createdIfNotExists} = createFakeFileCreator()

    generateFrontSrcEntityPages(
      fileCreator,
      prepareEntityWideGenerationArgs(projectArgs, projectArgs.allEntities.get('cities')!),
    )

    expect(created).toEqual([])
    expect(createdIfNotExists).toEqual([])
  })
})
