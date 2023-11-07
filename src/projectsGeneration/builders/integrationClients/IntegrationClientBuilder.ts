import {IntegrationClient} from '../buildedTypes'
import BaseBuilder from '../BaseBuilder'
import IntegrationClientQueryMethodsBuilder from './IntegrationClientQueryMethodsBuilder'
import IntegrationClientBaseModelBuilder from './IntegrationClientBaseModelBuilder'

class IntegrationClientBuilder extends BaseBuilder {
  protected queryMethods: IntegrationClientQueryMethodsBuilder[] = []
  public models: IntegrationClientBaseModelBuilder[] = []

  constructor(name: string, defaultLanguage: string, title?: string) {
    super(name, defaultLanguage, {singular: title})
  }

  addQueryMethod(
    name: string,
    title?: string,
  ): IntegrationClientQueryMethodsBuilder {
    if (this.queryMethods.some((f) => f.name === name)) {
      throw new Error(`There is already field with name "${name}" in args model`)
    }

    const field = new IntegrationClientQueryMethodsBuilder(this, name, this.defaultLanguage, title)
    this.queryMethods.push(field)

    return field
  }

  addModel(
    name: string,
    title?: string,
  ): IntegrationClientBaseModelBuilder {
    if (this.models.some((f) => f.name === name)) {
      throw new Error(`There is already field with name "${name}" in args model`)
    }

    const model = new IntegrationClientBaseModelBuilder(this, name, title ?? name, this.defaultLanguage)
    this.models.push(model)

    return model
  }

  build(): IntegrationClient {
    return {
      ...super.build(),
      type: 'integrationClient',
      queryMethods: this.queryMethods.map(m => m.build()),
      models: this.models.map(m => m.build()),
    }
  }
}

export default IntegrationClientBuilder
