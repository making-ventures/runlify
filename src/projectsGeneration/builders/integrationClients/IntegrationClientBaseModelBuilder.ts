import {IntegrationClientBaseModel} from '../buildedTypes'
import { ScalarFieldBuilder } from '../fields/ScalarFieldBuilder'

class IntegrationClientBaseModelBuilder {
  protected defaultLanguage: string
  protected fields: ScalarFieldBuilder[] = []

  constructor(defaultLanguage: string) {
    this.defaultLanguage = defaultLanguage
  }

  addField(
    name: string,
    title?: string,
  ): ScalarFieldBuilder {
    if (this.fields.some((f) => f.name === name)) {
      throw new Error(`There is already field with name "${name}" in args model`)
    }

    const field = new ScalarFieldBuilder(name, this.defaultLanguage, title)
    this.fields.push(field)

    return field
  }

  delField(name: string) {
    this.fields = this.fields.filter((f) => f.name !== name)

    return this
  }

  build(): IntegrationClientBaseModel {
    return {
      fields: this.fields.map((field) => field.build()),
    }
  }
}

export default IntegrationClientBaseModelBuilder
