import {expect} from 'jest-without-globals'
import SystemMetaBuilder from '../../../../../builders/SystemMetaBuilder'
import {NumberType, StringType} from '../../../../../builders/buildedTypes'
import {
  prepareEntityWideGenerationArgs,
  prepareProjectWideGenerationArgs,
} from '../../../../../args'
import {defaultBootstrapEntityOptions} from '../../../../../types'
import {buildEntityDescriptorData} from './buildEntityDescriptorData'

// yarn test --testPathPattern buildEntityDescriptorData

const buildArgs = (system: SystemMetaBuilder, entityName: string) => {
  const projectArgs = prepareProjectWideGenerationArgs(system.build(), {
    ...defaultBootstrapEntityOptions,
  })
  const entity = projectArgs.allEntities.get(entityName)

  if (!entity) {
    throw new Error(`There is no "${entityName}" entity in the test system`)
  }

  return prepareEntityWideGenerationArgs(projectArgs, entity)
}

const getCatalogSystem = () => {
  const system = new SystemMetaBuilder('test')

  const cities = system.addCatalog('cities')
  cities.addField('title').setType('string')
  cities.setSort('title', 'ASC')

  const accountLevels = system.addCatalog('accountLevels')
  accountLevels.addField('title').setType('string')
  accountLevels.addField('amount').setType('bigint').setNumberType(NumberType.Money)
  accountLevels.addField('actionStartDate').setType('date').setFilters(['gte', 'lte'])
  accountLevels.addField('description').setType('string').setStringType(StringType.Markdown)
  accountLevels.addLinkField('cities', 'cityId')
  accountLevels.getForms().setUiPagesMode('descriptor')

  const profiles = system.addCatalog('mdProfiles')
  profiles.addField('name').setType('string')
  profiles.addField('secret').setType('string').setHidden()
  profiles.addField('note').setType('string').setStringType(StringType.Markdown)
  profiles.addLinkField('accountLevels', 'accountLevelId')

  return system
}

describe('buildEntityDescriptorData', () => {
  test('catalog: general data', () => {
    const data = buildEntityDescriptorData(buildArgs(getCatalogSystem(), 'accountLevels'))

    expect(data.name).toBe('accountLevels')
    expect(data.type).toBe('catalog')
    expect(data.names).toEqual({singular: 'accountLevel', pascalSingular: 'AccountLevel'})
    expect(data.i18n).toEqual({
      titlePlural: 'catalogs.accountLevels.title.plural',
      titleSingular: 'catalogs.accountLevels.title.singular',
    })
    expect(data.sort).toEqual({field: 'id', order: 'DESC'})
    expect(data.permissions).toEqual({
      get: 'accountLevels.get',
      update: 'accountLevels.update',
      delete: 'accountLevels.delete',
      all: 'accountLevels.all',
    })
    expect(data.hasSearch).toBe(true)
    expect(data.registrarDepended).toBe(false)
    expect(data.registries).toEqual([])
    expect(data.removableByUser).toBe(true)
    expect(data.updatableByUser).toBe(true)
    expect(data.exportableByUser).toBe(true)
  })

  test('catalog: fields keep meta order and include hidden ones', () => {
    const data = buildEntityDescriptorData(buildArgs(getCatalogSystem(), 'accountLevels'))

    expect(data.fields.map((f) => f.name)).toEqual([
      'id',
      'search',
      'title',
      'amount',
      'actionStartDate',
      'description',
      'cityId',
    ])
    expect(data.fields.find((f) => f.name === 'search')?.hidden).toBe(true)
  })

  test('catalog: scalar field attributes', () => {
    const data = buildEntityDescriptorData(buildArgs(getCatalogSystem(), 'accountLevels'))

    expect(data.fields.find((f) => f.name === 'title')).toEqual({
      name: 'title',
      type: 'string',
      category: 'scalar',
      labelKey: 'catalogs.accountLevels.fields.title',
      hidden: false,
      required: false,
      showInList: true,
      showInShow: true,
      showInFilter: true,
      filters: ['equal'],
      stringType: 'plain',
      showInCreate: true,
      showInEdit: true,
      requiredOnInput: null,
      sharded: false,
    })
    expect(data.fields.find((f) => f.name === 'amount')?.numberType).toBe('money')
    expect(data.fields.find((f) => f.name === 'description')?.stringType).toBe('markdown')
    expect(data.fields.find((f) => f.name === 'actionStartDate')?.filters).toEqual(['gte', 'lte'])
  })

  test('catalog: link field keeps sort of the linked entity', () => {
    const data = buildEntityDescriptorData(buildArgs(getCatalogSystem(), 'accountLevels'))

    expect(data.fields.find((f) => f.name === 'cityId')?.link).toEqual({
      entity: 'cities',
      isImage: false,
      sort: {field: 'title', order: 'ASC'},
      permissions: {all: 'cities.all', get: 'cities.get'},
    })
  })

  test('catalog: image link field is marked', () => {
    const system = getCatalogSystem()
    system.getCatalogByName('accountLevels').addImageField('photoId')

    const data = buildEntityDescriptorData(buildArgs(system, 'accountLevels'))

    expect(data.fields.find((f) => f.name === 'photoId')?.link?.isImage).toBe(true)
  })

  test('catalog: filterFields are taken from forms as is', () => {
    const system = getCatalogSystem()
    system.getCatalogByName('accountLevels').getForms().getListForm().getFilter()
      .getField('title')
      .setAlwaysOn(true)

    const data = buildEntityDescriptorData(buildArgs(system, 'accountLevels'))

    expect(data.filterFields).toContainEqual({name: 'title', hidden: false, alwaysOn: true})
    expect(data.filterFields).toContainEqual({name: 'search', hidden: true, alwaysOn: false})
  })

  test('catalog: form keys of the entity fields', () => {
    const system = getCatalogSystem()
    const accountLevels = system.getCatalogByName('accountLevels')
    accountLevels.addField('hiddenInCreate').setType('string').setShowInCreate(false)
    accountLevels.addField('hiddenInEdit').setType('string').setShowInEdit(false)
    accountLevels.addField('debugOnly').setType('string').setRequiredOnInput(false)
    accountLevels.addField('shardKey').setType('string').setSharded()

    const data = buildEntityDescriptorData(buildArgs(system, 'accountLevels'))
    const byName = (name: string) => data.fields.find((f) => f.name === name)!

    expect(byName('hiddenInCreate').showInCreate).toBe(false)
    expect(byName('hiddenInCreate').showInEdit).toBe(true)
    expect(byName('hiddenInEdit').showInEdit).toBe(false)
    expect(byName('debugOnly').requiredOnInput).toBe(false)
    expect(byName('title').requiredOnInput).toBe(null)
    expect(byName('shardKey').sharded).toBe(true)
    expect(byName('title').sharded).toBe(false)
  })

  test('catalog: dependency tab fields have no form keys', () => {
    const data = buildEntityDescriptorData(buildArgs(getCatalogSystem(), 'accountLevels'))
    const tabFieldKeys = data.dependencyTabs[0].fields!.flatMap((f) => Object.keys(f))

    for (const key of ['showInCreate', 'showInEdit', 'requiredOnInput', 'sharded', 'defaultValue']) {
      expect(tabFieldKeys).not.toContain(key)
    }
  })

  test('defaultValue: bool without an expression falls back to false', () => {
    const system = getCatalogSystem()
    system.getCatalogByName('accountLevels').addField('locked').setType('bool')

    const data = buildEntityDescriptorData(buildArgs(system, 'accountLevels'))

    expect(data.fields.find((f) => f.name === 'locked')!.defaultValue).toBe(false)
    // fields without a default do not get the key at all
    expect(data.fields.find((f) => f.name === 'title')).not.toHaveProperty('defaultValue')
  })

  test('defaultValue: literal expressions are kept as data', () => {
    const system = getCatalogSystem()
    const accountLevels = system.getCatalogByName('accountLevels')
    accountLevels.addField('emptyString').setType('string').setDefaultValueExpression("''")
    accountLevels.addField('state').setType('string').setDefaultValueExpression("'active'")
    accountLevels.addField('counter').setType('int').setDefaultValueExpression('0')
    accountLevels.addField('rate').setType('float').setDefaultValueExpression('1.5')
    accountLevels.addField('enabled').setType('bool').setDefaultValueExpression('true')

    const data = buildEntityDescriptorData(buildArgs(system, 'accountLevels'))
    const defaultValueOf = (name: string) => data.fields.find((f) => f.name === name)!.defaultValue

    expect(defaultValueOf('emptyString')).toBe('')
    expect(defaultValueOf('state')).toBe('active')
    expect(defaultValueOf('counter')).toBe(0)
    expect(defaultValueOf('rate')).toBe(1.5)
    expect(defaultValueOf('enabled')).toBe(true)
  })

  test('defaultValue: new Date() and Date.now() become the "now" marker', () => {
    const system = getCatalogSystem()
    const accountLevels = system.getCatalogByName('accountLevels')
    accountLevels.addField('changedAt').setType('datetime').setDefaultValueExpression('new Date()')
    accountLevels.addField('createdAt').setType('datetime').setDefaultValueExpression('Date.now()')

    const data = buildEntityDescriptorData(buildArgs(system, 'accountLevels'))

    expect(data.fields.find((f) => f.name === 'changedAt')!.defaultValue).toEqual({kind: 'now'})
    expect(data.fields.find((f) => f.name === 'createdAt')!.defaultValue).toEqual({kind: 'now'})
  })

  test('defaultValue: an unsupported expression throws', () => {
    const system = getCatalogSystem()
    system
      .getCatalogByName('accountLevels')
      .addField('token')
      .setType('string')
      .setDefaultValueExpression('makeToken()')

    expect(() => buildEntityDescriptorData(buildArgs(system, 'accountLevels'))).toThrow(
      'Entity "accountLevels", field "token": unsupported defaultValueExpression "makeToken()" for the descriptor mode',
    )
  })

  test('keyField: autoGenerated of the key field', () => {
    const data = buildEntityDescriptorData(buildArgs(getCatalogSystem(), 'accountLevels'))

    expect(data.keyField).toEqual({name: 'id', autoGenerated: true})

    const system = getCatalogSystem()
    // a string key is never auto generated (IdFieldBuilder.setType)
    system.getCatalogByName('accountLevels').getKey().setType('string')

    expect(buildEntityDescriptorData(buildArgs(system, 'accountLevels')).keyField).toEqual({
      name: 'id',
      autoGenerated: false,
    })
  })

  test('forms: enabled flags repeat creatableByUser/updatableByUser', () => {
    const data = buildEntityDescriptorData(buildArgs(getCatalogSystem(), 'accountLevels'))

    expect(data.forms).toEqual({create: {enabled: true}, edit: {enabled: true}})

    const system = getCatalogSystem()
    system.getCatalogByName('accountLevels').setCreatableByUser(false).setUpdatableByUser(false)

    const disabled = buildEntityDescriptorData(buildArgs(system, 'accountLevels'))

    expect(disabled.forms).toEqual({create: {enabled: false}, edit: {enabled: false}})
    expect(disabled.updatableByUser).toBe(false)
  })

  test('catalog: dependency tabs with owner fields', () => {
    const data = buildEntityDescriptorData(buildArgs(getCatalogSystem(), 'accountLevels'))

    expect(data.dependencyTabs).toHaveLength(1)

    const [tab] = data.dependencyTabs

    expect(tab.ownerEntity).toBe('mdProfiles')
    expect(tab.ownerType).toBe('catalog')
    expect(tab.fromField).toBe('accountLevelId')
    expect(tab.path).toBe('mdProfiles-accountLevelId')
    expect(tab.labelKey).toBe('catalogs.mdProfiles.title.plural')
    expect(tab.permissions).toEqual({get: 'mdProfiles.get'})
    // hidden and markdown fields of the owner are skipped, labels are the owner's ones
    expect(tab.fields!.map((f) => f.name)).toEqual(['id', 'name', 'accountLevelId'])
    expect(tab.fields![1].labelKey).toBe('catalogs.mdProfiles.fields.name')
  })

  test('catalog: a descriptor owner prints no inline tab fields', () => {
    const system = getCatalogSystem()
    system.getCatalogByName('mdProfiles').getForms().setUiPagesMode('descriptor')

    const data = buildEntityDescriptorData(buildArgs(system, 'accountLevels'))
    const [tab] = data.dependencyTabs

    // the owner descriptor carries the fields itself, the UI resolves them through its registry
    expect(tab).not.toHaveProperty('fields')
    expect(tab).toEqual({
      ownerEntity: 'mdProfiles',
      ownerType: 'catalog',
      fromField: 'accountLevelId',
      path: 'mdProfiles-accountLevelId',
      labelKey: 'catalogs.mdProfiles.title.plural',
      permissions: {get: 'mdProfiles.get'},
    })
  })

  test('catalog: ignoredLinkedEntities without field removes the tab', () => {
    const system = getCatalogSystem()
    system
      .getCatalogByName('accountLevels')
      .getForms()
      .getShowForm()
      .addIgnoredLinkedEntity('mdProfiles')

    const data = buildEntityDescriptorData(buildArgs(system, 'accountLevels'))

    expect(data.dependencyTabs).toEqual([])
  })

  test('catalog: ignoredLinkedEntities with field removes only that link', () => {
    const system = getCatalogSystem()
    system.getCatalogByName('mdProfiles').addLinkField('accountLevels', 'secondLevelId')
    system
      .getCatalogByName('accountLevels')
      .getForms()
      .getShowForm()
      .addIgnoredLinkedEntity('mdProfiles', 'accountLevelId')

    const data = buildEntityDescriptorData(buildArgs(system, 'accountLevels'))

    expect(data.dependencyTabs.map((t) => t.path)).toEqual(['mdProfiles-secondLevelId'])
  })

  test('document: registries get their type', () => {
    const system = new SystemMetaBuilder('test')
    system.addInfoRegistry('orderStates', false)
    const orders = system.addDocument('orders')
    orders.addRegistry('orderStates')
    orders.getForms().setUiPagesMode('descriptor')

    const data = buildEntityDescriptorData(buildArgs(system, 'orders'))

    expect(data.type).toBe('document')
    expect(data.hasSearch).toBe(true)
    expect(data.registries).toEqual([{name: 'orderStates', type: 'infoRegistry'}])
    expect(data.names).toEqual({singular: 'order', pascalSingular: 'Order'})
  })

  test('infoRegistry: registrarDepended and searchEnabled=false', () => {
    const system = new SystemMetaBuilder('test')
    system.addCatalog('entities').addField('title').setType('string')
    const serviceCosts = system.addInfoRegistry('serviceCosts', true)
    serviceCosts.setSearchEnabled(false)
    serviceCosts.getForms().setUiPagesMode('descriptor')

    const data = buildEntityDescriptorData(buildArgs(system, 'serviceCosts'))

    expect(data.type).toBe('infoRegistry')
    expect(data.registrarDepended).toBe(true)
    expect(data.hasSearch).toBe(false)
    expect(data.registries).toEqual([])
  })

  test('infoRegistry with searchEnabled has search', () => {
    const system = new SystemMetaBuilder('test')
    const costs = system.addInfoRegistry('costs', false)
    costs.setSearchEnabled(true)

    expect(buildEntityDescriptorData(buildArgs(system, 'costs')).hasSearch).toBe(true)
  })

  test('throws for an entity with allowedToChange', () => {
    const system = new SystemMetaBuilder('test')
    const orders = system.addCatalog('orders')
    orders.setAllowedToChange('(record) => record.state === "new"')

    expect(() => buildEntityDescriptorData(buildArgs(system, 'orders'))).toThrow(
      'Entity "orders" has "allowedToChange" and cannot be generated in the "descriptor" ui pages mode',
    )
  })
})
