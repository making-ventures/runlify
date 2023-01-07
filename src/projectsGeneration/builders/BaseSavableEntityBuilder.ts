/* eslint-disable max-len */
import { ScalarFieldBuilder } from './fields/ScalarFieldBuilder'
import { IdFieldBuilder } from './fields/IdFieldBuilder'
import { LinkFieldBuilder } from './fields/LinkFieldBuilder'
import { EtityType, TKeyFieldType, Multitenancy } from './buildedTypes'
import CatalogBuilder from './CatalogBuilder'
import BaseBuilder from './BaseBuilder'
import { FormsBuilder } from './ui/FormsBuilder'
import { FieldBuilder } from './types'
import { ViewLinkFieldBuilder } from './fields/ViewLinkFieldBuilder'

abstract class BaseSavableEntityBuilder extends BaseBuilder {
  id: IdFieldBuilder
  fields: FieldBuilder[] = []
  uniqueConstraints: string[][] = []
  type: EtityType = 'catalog'
  titleField: ScalarFieldBuilder | IdFieldBuilder
  deletable = false
  editable = true
  singleKey = true
  logging = false
  auditable = true
  space = ''
  sortField = 'id'
  sortOrder: 'ASC' | 'DESC' = 'DESC'
  sybsystems: string[] = []
  forms?: FormsBuilder
  predefinedElements: Record<string, any>[] = []
  devPerefinedElements: Record<string, any>[] = []
  externalSearch = false
  multitenancy: Multitenancy = 'none'
  commonElementsVisibleToAll = false

  constructor(name: string, defaultLanguage: string, title?: string) {
    super(name, defaultLanguage, title)

    this.id = new IdFieldBuilder('id', defaultLanguage)
      .setTitle('Id', 'en')
      .setTitle('Ид', 'ru')
    this.titleField = new IdFieldBuilder('id', defaultLanguage)

    this.setTitleFieldByName(this.getKey().name)
  }

  setExternalSearch(externalSearch?: boolean) {
    this.externalSearch = externalSearch ?? true

    return this
  }

  setAuditable(auditable?: boolean) {
    this.auditable = auditable ?? true

    return this
  }

  setDeletable(deletable?: boolean) {
    this.deletable = deletable ?? true

    return this
  }
  setEditable(editable?: boolean) {
    this.editable = editable ?? true

    return this
  }
  getKey() {
    if (!this.singleKey) {
      throw new Error('There is no single key')
    }

    return this.id
  }

  getFileds(): FieldBuilder[] {
    return [this.id, ...this.fields]
  }

  getFiled(name: string): FieldBuilder {
    const filed = this.getFileds().find((f) => f.name === name)
    if (!filed) {
      throw new Error(`There is no field with name "${name}"`)
    }

    return filed
  }

  getLinkFileds(): LinkFieldBuilder[] {
    return this.getFileds().filter(
      (field) => field.category === 'link'
    ) as LinkFieldBuilder[]
  }

  addField(
    name: string,
    title?: string,
    { isTitleField }: { isTitleField?: boolean } = {}
  ): ScalarFieldBuilder {
    if (this.fields.some((f) => f.name === name)) {
      throw new Error(
        `There is already field with name "${name}". Entity ${this.name}`
      )
    }

    const field = new ScalarFieldBuilder(name, this.defaultLanguage, title)
    this.fields.push(field)

    if (isTitleField) {
      this.setTitleFieldByName(name)
    }

    return field
  }

  delField(name: string) {
    this.fields = this.fields.filter((f) => f.name !== name)

    return this
  }

  addLinkField(
    e: string | CatalogBuilder,
    name: string,
    title?: string
  ): LinkFieldBuilder {
    let entity = e
    if (this.fields.some((f) => f.name === name)) {
      throw new Error(
        `There is already field with name "${name}". Entity ${this.name}`
      )
    }

    // get name from entity
    if (entity instanceof CatalogBuilder) {
      entity = entity.name
    }

    const field = new LinkFieldBuilder(
      entity,
      name,
      this.defaultLanguage,
      title
    )

    // get field type from entity
    if (e instanceof CatalogBuilder) {
      const entityType = e.fields.find(
        (field: FieldBuilder) => field instanceof IdFieldBuilder
      )?.type as TKeyFieldType | undefined

      if (entityType && field.type !== entityType) {
        field.setType(entityType)
      }
    }

    this.fields.push(field)

    return field
  }

  addFileField(name: string, title?: string): LinkFieldBuilder {
    const entity = 'files'
    if (this.fields.some((f) => f.name === name)) {
      throw new Error(
        `There is already field with name "${name}". Entity ${this.name}`
      )
    }

    const field = new LinkFieldBuilder(
      entity,
      name,
      this.defaultLanguage,
      title
    )
    field.setPredefinedLinkedEntity('file')

    this.fields.push(field)

    return field
  }

  addImageField(name: string, title?: string): LinkFieldBuilder {
    const entity = 'files'
    if (this.fields.some((f) => f.name === name)) {
      throw new Error(
        `There is already field with name "${name}". Entity ${this.name}`
      )
    }

    const field = new LinkFieldBuilder(
      entity,
      name,
      this.defaultLanguage,
      title
    )
    field.setPredefinedLinkedEntity('file')
    field.setFileType('image')

    this.fields.push(field)

    return field
  }

  addViewLinkField(
    e: string | CatalogBuilder,
    name: string,
    title?: string
  ): ViewLinkFieldBuilder {
    let entity = e
    if (this.fields.some((f) => f.name === name)) {
      throw new Error(
        `There is already field with name "${name}". Entity ${this.name}`
      )
    }

    // get name from entity
    if (entity instanceof CatalogBuilder) {
      entity = entity.name
    }

    const field = new ViewLinkFieldBuilder(
      entity,
      name,
      this.defaultLanguage,
      title
    )

    // get field type from entity
    if (e instanceof CatalogBuilder) {
      const entityType = e.fields.find(
        (field: FieldBuilder) => field instanceof IdFieldBuilder
      )?.type as TKeyFieldType | undefined

      if (entityType && field.type !== entityType) {
        field.setType(entityType)
      }
    }

    this.fields.push(field)

    return field
  }

  setTitleFieldByName(titleField: string) {
    const field = this.getFileds().find((f) => f.name === titleField) as
      | ScalarFieldBuilder
      | IdFieldBuilder
      | undefined
    if (!field) {
      throw new Error(
        `There is no field with name "${titleField}", you can not set it as a title field. Entity ${this.name}`
      )
    }

    this.titleField = field

    return this
  }

  setSort(field: string, order: 'ASC' | 'DESC') {
    if (!this.getFileds().some((f) => f.name === field)) {
      throw new Error(
        `There is no field with name "${field}", you can not set sort to this field. Entity ${this.name}`
      )
    }

    this.sortField = field
    this.sortOrder = order

    return this
  }

  addUniqueConstraint(fields: string[]): BaseSavableEntityBuilder {
    const currentFields = this.getFileds()

    // const currentRequiredFields = currentFields.filter(f => f.required);
    const currentFieldNames = currentFields.map((f) => f.name)

    // const currentRequiredFieldNames = currentRequiredFields.map(f => f.name);
    if (fields.some((f) => !currentFieldNames.includes(f))) {
      throw new Error(`You trying to add constraint for non existing field.
      Current fields: ${currentFields}, fields for constrain: ${fields}, field not in current: ${fields.filter(
        (f) => !currentFieldNames.includes(f)
      )}.
      Entity ${this.name}`)
    }

    // if (fields.some(f => !currentRequiredFieldNames.includes(f))) {
    //   throw new Error(`You trying to add constraint for not required field. Presence of not required filed breaks uniquiness check.
    //   Current required fields: ${currentFields}, fields for constrain: ${fields}, field not in current: ${fields.filter(f => !currentRequiredFieldNames.includes(f))}.
    //   Entity ${this.name}`);
    // }

    this.uniqueConstraints.push(fields)

    return this
  }

  // todo: realize recurring build method

  initFormas(): BaseSavableEntityBuilder {
    if (!this.forms) {
      this.forms = new FormsBuilder(() => this)
    }

    return this
  }

  getForms(): FormsBuilder {
    this.initFormas()

    return this.forms as FormsBuilder
  }

  addPredefinedElements(fields: Record<string, any>[]) {
    this.predefinedElements.push(...fields)
  }

  addDevPredefinedElements(fields: Record<string, any>[]) {
    this.devPerefinedElements.push(...fields)
  }

  setMultitenancy(
    multitenancy: Multitenancy,
    commonElementsVisibleToAll?: boolean
  ) {
    this.multitenancy = multitenancy

    if (
      multitenancy !== 'optional' &&
      commonElementsVisibleToAll !== undefined
    ) {
      throw new Error(
        `You are trying to specify commonElementsVisibleToAll, but multitenancy is not optional (${multitenancy})`
      )
    }

    this.commonElementsVisibleToAll =
      commonElementsVisibleToAll || multitenancy === 'optional'

    this.delField('tenantId')
    if (multitenancy !== 'none') {
      const tenantField = this.addLinkField('tenants', 'tenantId')
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
}

export default BaseSavableEntityBuilder
