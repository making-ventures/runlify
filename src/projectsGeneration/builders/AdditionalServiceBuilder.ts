import {AdditionalService, MethodType} from './buildedTypes'
import BaseBuilder from './BaseBuilder'
import MethodBuilder, {MethodsModelsHolder} from './mehods/MethodBuilder'
import BaseModelBuilder from './mehods/BaseModelBuilder'

class AdditionalServiceBuilder extends BaseBuilder implements MethodsModelsHolder {
  protected methods: MethodBuilder[] = [];
  protected generalModels: BaseModelBuilder[] = []; // models that may be used as input or output
  protected inputModels: BaseModelBuilder[] = []; // models that may be used only as input
  protected outputModels: BaseModelBuilder[] = []; // models that may be used only as output

  constructor(name: string, defaultLanguage: string, title?: string) {
    super(name, defaultLanguage, {singular: title})
  }

  addMethod(
    name: string,
    methodType: MethodType,
    title?: string,
  ): MethodBuilder {
    if (this.methods.some((f) => f.name === name)) {
      throw new Error(`There is already method with "${name}" name`)
    }

    const method = new MethodBuilder(this, name, methodType, this.defaultLanguage, title)
    this.methods.push(method)

    this.addCreatedInputModel(method.getArgsModel());
    this.addCreatedOutputModel(method.getReturnModel());

    return method;
  }

  getAllModels(): BaseModelBuilder[] {
    return [
      ...this.inputModels,
      ...this.outputModels,
      ...this.generalModels,
    ]
  }

  addGeneralModel(
    name: string,
    title?: string,
  ): BaseModelBuilder {
    if (this.getAllModels().some((f) => f.name === name)) {
      throw new Error(`There is already field with name "${name}" in args model`)
    }

    const model = new BaseModelBuilder(this, name, title ?? name, this.defaultLanguage)
    this.generalModels.push(model)

    return model
  }

  addInputModel(
    name: string,
    title?: string,
  ): BaseModelBuilder {
    if (this.getAllModels().some((f) => f.name === name)) {
      throw new Error(`There is already field with name "${name}" in args model`)
    }

    const model = new BaseModelBuilder(this, name, title ?? name, this.defaultLanguage)
    this.inputModels.push(model)

    return model
  }

  addOutputModel(
    name: string,
    title?: string,
  ): BaseModelBuilder {
    if (this.getAllModels().some((f) => f.name === name)) {
      throw new Error(`There is already field with name "${name}" in args model`)
    }

    const model = new BaseModelBuilder(this, name, title ?? name, this.defaultLanguage)
    this.outputModels.push(model)

    return model
  }

  addCreatedGeneralModel(model: BaseModelBuilder) {
    if (this.getAllModels().some((f) => f.name === model.name)) {
      throw new Error(`There is already field with name "${model.name}" in args model`)
    }

    this.generalModels.push(model);
  }

  addCreatedInputModel(model: BaseModelBuilder) {
    if (this.getAllModels().some((f) => f.name === model.name)) {
      throw new Error(`There is already field with name "${model.name}" in args model`)
    }

    this.inputModels.push(model);
  }

  addCreatedOutputModel(model: BaseModelBuilder) {
    if (this.getAllModels().some((f) => f.name === model.name)) {
      throw new Error(`There is already field with name "${model.name}" in args model`)
    }

    this.outputModels.push(model);
  }

  getMethods() {
    return this.methods;
  }

  getGeneralModels() {
    return this.generalModels;
  }

  getInputModels() {
    return this.inputModels;
  }

  getOutputModels() {
    return this.outputModels;
  }

  build(): AdditionalService {
    return {
      ...super.build(),
      type: 'additionalService',
      methods: this.methods.map(m => m.build()),
      generalModels: this.generalModels.map(m => m.build()),
      inputModels: this.inputModels.map(m => m.build()),
      outputModels: this.outputModels.map(m => m.build()),
    }
  }
}

export default AdditionalServiceBuilder
