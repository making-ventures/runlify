import {AdditionalService, AdditionalServiceMethodType} from '../buildedTypes'
import BaseBuilder from '../BaseBuilder'
import AdditionalServiceMethodsBuilder from './AdditionalServiceMethodsBuilder'
import AdditionalServiceBaseModelBuilder from './AdditionalServiceBaseModelBuilder'

class AdditionalServiceBuilder extends BaseBuilder {
  protected methods: AdditionalServiceMethodsBuilder[] = []
  public models: AdditionalServiceBaseModelBuilder[] = []

  constructor(name: string, defaultLanguage: string, title?: string) {
    super(name, defaultLanguage, {singular: title})
  }

  addMethod(
    name: string,
    methodType: AdditionalServiceMethodType,
    title?: string,
  ): AdditionalServiceMethodsBuilder {
    if (this.methods.some((f) => f.name === name)) {
      throw new Error(`There is already field with name "${name}" in args model`)
    }

    const field = new AdditionalServiceMethodsBuilder(this, name, methodType, this.defaultLanguage, title)
    this.methods.push(field)

    return field
  }

  addModel(
    name: string,
    title?: string,
  ): AdditionalServiceBaseModelBuilder {
    if (this.models.some((f) => f.name === name)) {
      throw new Error(`There is already field with name "${name}" in args model`)
    }

    const model = new AdditionalServiceBaseModelBuilder(this, name, title ?? name, this.defaultLanguage)
    this.models.push(model)

    return model
  }

  build(): AdditionalService {
    return {
      ...super.build(),
      type: 'additionalService',
      methods: this.methods.map(m => m.build()),
      models: this.models.map(m => m.build()),
    }
  }
}

export default AdditionalServiceBuilder
