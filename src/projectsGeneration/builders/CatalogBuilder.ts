import {Catalog} from './buildedTypes'
import BaseSavableEntityBuilder from './BaseSavableEntityBuilder'

class CatalogBuilder extends BaseSavableEntityBuilder {
  protected type = 'catalog' as const

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
      type: this.type,
      deletable: this.deletable,
      editable: this.editable,
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
