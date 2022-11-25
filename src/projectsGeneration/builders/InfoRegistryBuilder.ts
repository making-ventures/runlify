import { InfoRegistry, InfoRegistryPeriod, Multitenancy } from './buildedTypes'
import BaseSavableEntityBuilder from './BaseSavableEntityBuilder'
import { ScalarFieldBuilder } from './fields/ScalarFieldBuilder'
import { LinkFieldBuilder } from './fields/LinkFieldBuilder'
import { FieldBuilder } from './types'
import { ViewLinkFieldBuilder } from './fields/ViewLinkFieldBuilder'
import { defaultRegistryOptions, RegistryOptions } from './SumRegistryBuilder'

export class InfoRegistryBuilder extends BaseSavableEntityBuilder {
  registrarDepended = false
  dimensions: FieldBuilder[] = []
  resources: FieldBuilder[] = []
  period: InfoRegistryPeriod = 'notPeriodic'
  options: RegistryOptions

  constructor(
    name: string,
    registrarDepended: boolean,
    defaultLanguage: string,
    title?: string,
    options?,
  ) {
    super(name, defaultLanguage, title)

    this.options = options ?? defaultRegistryOptions
    this.registrarDepended = registrarDepended

    if (this.registrarDepended) {
      this.addDimensionLinkField('entities', 'registrarTypeId')
        .setTitles({ ru: 'Тип регистратора', en: 'Registrar type' })
        .setType('string')
        .setRequired()
      this.addDimension('registrarId')
      .setType(this.options.registrarIdType === 'string' ? 'string' : 'int')
        .setTitles({ ru: 'Ид регистратора', en: 'Registrar id' })
        .setRequired()
      this.addDimension('row')
        .setType('int')
        .setRequired()
        .setDefaultDbValue('1')
      this.addUniqueConstraint(['registrarTypeId', 'registrarId', 'row'])
    }
  }

  getDimension(name: string): FieldBuilder {
    const filed = this.dimensions.find((f) => f.name === name)
    if (!filed) {
      throw new Error(`There is no dimension with name "${name}"`)
    }

    return filed
  }

  getResource(name: string): FieldBuilder {
    const filed = this.resources.find((f) => f.name === name)
    if (!filed) {
      throw new Error(`There is no resource with name "${name}"`)
    }

    return filed
  }

  build(): InfoRegistry {
    return {
      type: 'infoRegistry',
      name: this.name,
      registrarDepended: this.registrarDepended,
      title: this.title,
      singleKey: this.singleKey,
      needFor: this.needFor,
      // titleField: this.titleField.build(),
      titleField: this.titleField.name,
      // linkFields: this.getLinkFileds().map(f => f.build()),
      dimensions: this.dimensions.map((f) => f.build()),
      resources: this.resources.map((f) => f.build()),
      // keyField: this.getKey().build(),
      keyField: this.getKey().name,
      fields: this.getFileds().map((field) => field.build()),
      uniqueConstraints: [
        this.dimensions.map((d) => d.name),
        ...this.uniqueConstraints,
      ],
      materialUiIcon: this.materialUiIcon,
      forms: this.getForms().build(),
      predefinedElements: this.predefinedElements,
      devPerefinedElements: this.devPerefinedElements,
      auditable: this.auditable,
      externalSearch: this.externalSearch,
      period: this.period,
      sortField: this.sortField,
      sortOrder: this.sortOrder,
      multitenancy: this.multitenancy,
      commonElementsVisibleToAll: this.commonElementsVisibleToAll,
    }
  }

  setPeriod(period: InfoRegistryPeriod) {
    this.period = period
    if (period !== 'notPeriodic') {
      this.addDimension('date')
        .setType(period === 'second' ? 'datetime' : 'date')
        // .setNotUpdatableByUser()
        .setTitle('Date', 'en')
        .setTitle('Дата', 'ru')
        .setRequired()
    }

    return this
  }

  addField(
    _: string,
    __?: string,
    ___: { isTitleField?: boolean } = {}
  ): ScalarFieldBuilder {
    throw new Error('Use addDimension or addResource')
  }

  getFileds(): FieldBuilder[] {
    return [
      this.id,
      ...this.fields,
      ...(this.dimensions || []),
      ...(this.resources || []),
    ]
  }

  addLinkField(_: string, __: string): LinkFieldBuilder {
    throw new Error('Use addDimensionLinkField or addResourceLinkField')
  }

  addDimension(
    name: string,
    title?: string,
    { isTitleField }: { isTitleField?: boolean } = {}
  ) {
    if (this.fields.some((f) => f.name === name)) {
      throw new Error(
        `There is already field with name "${name}". Entity ${this.name}`
      )
    }

    const dimension = new ScalarFieldBuilder(name, this.defaultLanguage, title)
    this.dimensions.push(dimension)

    if (isTitleField) {
      this.setTitleFieldByName(name)
    }

    return dimension
  }

  addDimensionLinkField(
    entity: string,
    name: string,
    title?: string
  ): LinkFieldBuilder {
    if (this.fields.some((f) => f.name === name)) {
      throw new Error(
        `There is already field with name "${name}". Entity ${this.name}`
      )
    }

    const dimension = new LinkFieldBuilder(
      entity,
      name,
      this.defaultLanguage,
      title
    )
    this.dimensions.push(dimension)

    return dimension
  }

  addDimensionViewLinkField(
    entity: string,
    name: string,
    title?: string
  ): ViewLinkFieldBuilder {
    if (this.fields.some((f) => f.name === name)) {
      throw new Error(
        `There is already field with name "${name}". Entity ${this.name}`
      )
    }

    const dimension = new ViewLinkFieldBuilder(
      entity,
      name,
      this.defaultLanguage,
      title
    )
    this.dimensions.push(dimension)

    return dimension
  }

  addResource(
    name: string,
    title?: string,
    { isTitleField }: { isTitleField?: boolean } = {}
  ) {
    if (this.fields.some((f) => f.name === name)) {
      throw new Error(
        `There is already field with name "${name}". Entity ${this.name}`
      )
    }

    const resource = new ScalarFieldBuilder(name, this.defaultLanguage, title)
    this.resources.push(resource)

    if (isTitleField) {
      this.setTitleFieldByName(name)
    }

    return resource
  }

  addResourceLinkField(
    entity: string,
    name: string,
    title?: string
  ): LinkFieldBuilder {
    if (this.fields.some((f) => f.name === name)) {
      throw new Error(
        `There is already field with name "${name}". Entity ${this.name}`
      )
    }

    const resource = new LinkFieldBuilder(
      entity,
      name,
      this.defaultLanguage,
      title
    )
    this.resources.push(resource)

    return resource
  }

  addResourceViewLinkField(
    entity: string,
    name: string,
    title?: string
  ): ViewLinkFieldBuilder {
    if (this.fields.some((f) => f.name === name)) {
      throw new Error(
        `There is already field with name "${name}". Entity ${this.name}`
      )
    }

    const resource = new ViewLinkFieldBuilder(
      entity,
      name,
      this.defaultLanguage,
      title
    )
    this.resources.push(resource)

    return resource
  }

  setMultitenancy(multitenancy: Multitenancy) {
    this.multitenancy = multitenancy

    this.delField('tenantId')
    if (multitenancy !== 'none') {
      const tenantField = this.addDimensionLinkField('tenants', 'tenantId')
        .setType('int')
        .setNotUpdatableByUser()
      if (multitenancy === 'required') {
        tenantField
          .setRequired()
          .setNotUpdatableByUser(
            undefined,
            "await ctx.service('profile').getRequiredTenantId()"
          )
      }
    }
  }

  static fromObject(
    obj: InfoRegistry,
    defaultLanguage: string
  ): InfoRegistryBuilder {
    const builder = new InfoRegistryBuilder(
      obj.name,
      obj.registrarDepended,
      defaultLanguage
    )

    obj.fields.forEach((filed: any) => {
      if (filed.name !== 'id') {
        const addedField = builder.addField(filed.name).setType(filed.type)
        if (filed.required) {
          addedField.setRequired()
        } else {
          addedField.setNotRequired()
        }
      }
    })

    const idField = obj.fields.find((field: any) => field.name === 'id')
    if (idField?.type === 'string') {
      builder.getKey().setType('string')
    } else if (idField?.type === 'int') {
      builder.getKey().setType('int')
    } else {
      builder.getKey().setType('bigint')
    }

    return builder
  }
}
