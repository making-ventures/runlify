import { Catalog } from './buildedTypes'
import BaseSavableEntityBuilder from './BaseSavableEntityBuilder'

class CatalogBuilder extends BaseSavableEntityBuilder {
  constructor(name: string, defaultLanguage: string, title?: {singular?: string, plural?: string}) {
    super(name, defaultLanguage, title)

    this.addField('search')
      .setType('string')
      .setSearchable(false)
      .setNotUpdatableByUser("''")
      .setHidden()
      .setTitle('Search', 'en')
      .setTitle('Поиск', 'ru')
  }

  build(): Catalog {
    return {
      ...super.build(),
      title: this.title,
      type: 'catalog',
      singleKey: this.singleKey,
      // titleField: this.titleField.build(),
      titleField: this.titleField.name,
      // linkFields: this.getLinkFileds().map(f => f.build()),
      // keyField: this.getKey().build(),
      keyField: this.getKey().name,
      fields: this.getFileds().map((field) => field.build()),
      uniqueConstraints: this.uniqueConstraints,
      deletable: this.deletable,
      editable: this.editable,
      forms: this.getForms().build(),
      predefinedElements: this.predefinedElements,
      devPerefinedElements: this.devPerefinedElements,
      auditable: this.auditable,
      externalSearch: this.externalSearch,
      searchEnabled: this.searchEnabled,
      sortField: this.sortField,
      sortOrder: this.sortOrder,
      multitenancy: this.multitenancy,
      commonElementsVisibleToAll: this.commonElementsVisibleToAll,
      externalSearchName: this.externalSearchName,
      shardUniqKeys: this.shardUniqKeys,
      isExternalSearch: this.isExternalSearch,
      creatableByUser: this.creatableByUser,
    }
  }

  static fromObject(obj: any, defaultLanguage: string, title?: {singular?: string, plural?: string}): CatalogBuilder {
    const builder = new CatalogBuilder(obj.name, defaultLanguage, title)

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
    if (idField.type === 'string') {
      builder.getKey().setType('string')
    } else if (idField.type === 'int') {
      builder.getKey().setType('int')
    } else {
      builder.getKey().setType('bigint')
    }

    return builder
  }
}

export default CatalogBuilder
