import {AdditionalService, MethodType} from './buildedTypes'
import BaseBuilder from './BaseBuilder'
import MethodBuilder, {MethodsModelsHolder} from './mehods/MethodBuilder'
import BaseModelBuilder from './mehods/BaseModelBuilder'

class AdditionalServiceBuilder extends BaseBuilder implements MethodsModelsHolder {
  protected methods: MethodBuilder[] = []
  protected models: BaseModelBuilder[] = []

  constructor(name: string, defaultLanguage: string, title?: string) {
    super(name, defaultLanguage, {singular: title})
  }

  addMethod(
    name: string,
    methodType: MethodType,
    title?: string,
  ): MethodBuilder {
    if (this.methods.some((f) => f.name === name)) {
      throw new Error(`There is already field with name "${name}" in args model`)
    }

    const field = new MethodBuilder(this, name, methodType, this.defaultLanguage, title)
    this.methods.push(field)

    return field
  }

  addModel(
    name: string,
    title?: string,
  ): BaseModelBuilder {
    if (this.models.some((f) => f.name === name)) {
      throw new Error(`There is already field with name "${name}" in args model`)
    }

    const model = new BaseModelBuilder(this, name, title ?? name, this.defaultLanguage)
    this.models.push(model)

    return model
  }

  getMethods() {
    return this.methods;
  }

  getModels() {
    return this.models;
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
