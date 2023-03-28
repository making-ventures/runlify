import { Document } from './buildedTypes'
import BaseSavableEntityBuilder from './BaseSavableEntityBuilder'
import { DocumentationOfDocumentBuilder } from './docs/DocumentationOfDocumentBuilder'

class DocumentBuilder extends BaseSavableEntityBuilder {
  registries: string[] = []
  documentation: DocumentationOfDocumentBuilder =
    new DocumentationOfDocumentBuilder(() => this)

  constructor(name: string, defaultLanguage: string, title?: {singular?: string, plural?: string}) {
    super(name, defaultLanguage, title)

    // this
    //   .addField('carriedOut')
    //   .setType('bool')
    //   .setRequired()
    //   .setNotUpdatableByUser('false');

    this.addField('date')
      .setType('datetime')
      .setRequired()
      .setDefaultBackendValueExpression('new Date()')
      .setRequiredOnInput(false)
      .setTitle('Date', 'en')
      .setTitle('Дата', 'ru')

    this.addField('search')
      .setType('string')
      .setSearchable(false)
      .setNotUpdatableByUser("''")
      .setHidden()
      .setTitle('Search', 'en')
      .setTitle('Поиск', 'ru')
  }

  build(): Document {
    return {
      ...super.build(),
      title: this.title,
      type: 'document',
      singleKey: this.singleKey,
      // titleField: this.titleField.build(),
      titleField: this.titleField.name,
      // linkFields: this.getLinkFileds().map(f => f.build()),
      // keyField: this.getKey().build(),
      keyField: this.getKey().name,
      fields: this.getFileds().map((field) => field.build()),
      uniqueConstraints: this.uniqueConstraints,
      registries: this.registries,
      deletable: this.deletable,
      editable: this.editable,
      forms: this.getForms().build(),
      documentation: this.documentation.build(),
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
      updatableByUser: this.updatableByUser,
      removableByUser: this.removableByUser,
      exportableByUser: this.exportableByUser,
    }
  }

  addRegistry(registry: string) {
    this.registries.push(registry)
  }

  static fromObject(obj: any, defaultLanguage: string, title?: {singular?: string, plural?: string}): DocumentBuilder {
    const builder = new DocumentBuilder(obj.name, defaultLanguage, title)

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

  setSharded(uniqKeys: string[] = []) {
    this.addField('repostRequired', 'Обозначение что нужно обновить проводки')
      .setType('bool')
      .setDefaultDbValue('true')
      .setDefaultValueExpression('true')
      .setHidden()
      .setRequired()
    this.addField('deleteRequired', 'Используется для определения что нужно удалить документ, так как мы удаляем из')
      .setType('bool')
      .setDefaultDbValue('false')
      .setDefaultValueExpression('false')
      .setHidden()
      .setRequired()
    super.setSharded(uniqKeys)
    return this
  }
}

export default DocumentBuilder
