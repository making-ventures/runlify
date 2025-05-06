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

  // getInputModelsWithLinkedGeneral() {
  //   // const inputModelNames = [
  //   //   ...this.getMethods().flatMap(m => m.getReturnModel().getFields().filter(f => f.getCategory() === 'model').map(f => (f as ModelFieldBuilder).getModel())),
  //   // ];
  //   // const inputModelsFromGeneralModels = this.generalModels.filter(m => inputModelNames.includes(m.name));

  //   return {
  //     input: this.inputModels,
  //   };
  // }

// export const genGraphAdditionalServiceSchema = (service: AdditionalService) => {
//   const queries = service.methods.filter((method) => method.methodType === MethodType.Query);
//   const mutations = service.methods.filter((method) => method.methodType === MethodType.Mutation);

//   log.info(`names: ${queries.flatMap(q => q.argsModel.fields.filter(f => f.category === 'model').map(f => f.name)).join(', ')}`);;

//   const modelNamesFromArgs = [
//     ...queries.flatMap(q => getModelNamesFromFirlds(q.argsModel.fields)),
//     ...mutations.flatMap(q => getModelNamesFromFirlds(q.argsModel.fields)),
//   ];
//   const modelNamesFromResults = [
//     ...queries.flatMap(q => getModelNamesFromFirlds(q.returnModel.fields)),
//     ...mutations.flatMap(q => getModelNamesFromFirlds(q.returnModel.fields)),
//   ];

//   const argsModelNames = service.models.map(m => m.name).filter(n => modelNamesFromArgs.includes(n));

//   const argsModels = service.models.filter(m => argsModelNames.includes(m.name));
//   const outputModels = service.models.filter(m => returlModelNames.includes(m.name));

  getOutputModels() {
    return this.outputModels;
  }

  // getOutputModelsWithLinkedGeneral() {
  //   // // const getModelNamesFromFirlds = (fields: TsModelField[]) =>
  //   // //   fields.filter(f => f.category === 'model').map(f => (f as ModelField).model);
  //   // const resultModelNames = [
  //   //   ...this.getMethods().flatMap(m => m.getReturnModel().getFields().filter(f => f.getCategory() === 'model').map(f => (f as ModelFieldBuilder).getModel())),
  //   // ];
  //   // const resultModelsFromGeneralModels = this.generalModels.filter(m => resultModelNames.includes(m.name));

  //   return {
  //     output: this.outputModels,
  //   };
  // }

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
