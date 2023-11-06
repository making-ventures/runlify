import {IntegrationClient} from '../buildedTypes'
import BaseBuilder from '../BaseBuilder'
import IntegrationClientQueryMethodsBuilder from './IntegrationClientQueryMethodsBuilder'

class IntegrationClientBuilder extends BaseBuilder {
  protected queryMethods: IntegrationClientQueryMethodsBuilder[] = []

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

    const field = new IntegrationClientQueryMethodsBuilder(name, this.defaultLanguage, title)
    this.queryMethods.push(field)

    return field
  }

  build(): IntegrationClient {
    return {
      ...super.build(),
      type: 'integrationClient',
      queryMethods: this.queryMethods.map(m => m.build())
    }
  }
}

export default IntegrationClientBuilder
