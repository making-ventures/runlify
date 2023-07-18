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
      type: 'document',
      deletable: this.deletable,
      editable: this.editable,
      registries: this.registries,
      documentation: this.documentation.build(),
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

  setSharded (value = true) {
    if (value) {
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
    }

    super.setSharded(value)
    return this
  }
}

export default DocumentBuilder
