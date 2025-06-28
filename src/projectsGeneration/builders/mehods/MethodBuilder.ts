import {ServiceMethod, MethodType} from '../buildedTypes'
import BaseBuilder from '../BaseBuilder'
import ArgsModelBuilder from './ArgsModelBuilder';
import ReturnObjectBuilder from './ReturnObjectBuilder';
import BaseModelBuilder from './BaseModelBuilder';
import ReturnScalarBuilder from './ReturnScalarBuilder';
import ReturnVoidBuilder from './ReturnVoidBuilder';
import {pascal} from '../../../utils/cases';

export interface MethodsModelsHolder {
  name: string
  getMethods: () => MethodBuilder[]
  getAllModels: () => BaseModelBuilder[]
  getGeneralModels: () => BaseModelBuilder[]
  getInputModels: () => BaseModelBuilder[]
  getOutputModels: () => BaseModelBuilder[]
  createGeneralModel(name: string, title?: string): BaseModelBuilder
  createInputModel(name: string, title?: string): BaseModelBuilder
  createOutputModel(name: string, title?: string): BaseModelBuilder

  addGeneralModel(model: BaseModelBuilder): void
  addInputModel(model: BaseModelBuilder): void
  addOutputModel(model: BaseModelBuilder): void
}

class MethodBuilder extends BaseBuilder {
  protected service: MethodsModelsHolder;
  protected argsModel: ArgsModelBuilder;
  protected returnModel: ReturnObjectBuilder | ReturnScalarBuilder | ReturnVoidBuilder;
  protected exportedToApi = false;
  protected queable = false;
  protected methodType: MethodType;
  protected worker?: string;
  protected runSchedule: string[] = [];
  protected returnType: 'object' | 'scalar' | 'void';
  protected async = false;

  constructor(
    service: MethodsModelsHolder,
    name: string,
    methodType: MethodType,
    defaultLanguage: string,
    title?: string
  ) {
    super(name, defaultLanguage, {singular: title})

    this.service = service;
    this.argsModel = new ArgsModelBuilder(service, name, defaultLanguage);
    this.returnModel = new ReturnVoidBuilder(service);
    this.returnType = 'void';
    this.methodType = methodType;
  }

  getArgsModel(): ArgsModelBuilder {
    return this.argsModel
  }

  getReturnModel(): ReturnObjectBuilder | ReturnScalarBuilder | ReturnVoidBuilder {
    return this.returnModel
  }

  getReturnObjectModel(): ReturnObjectBuilder {
    if (this.returnType !== 'object') {
      throw new Error(`Cant'return scalar return model, current return type: ${this.returnType}`);
    }

    return this.returnModel as ReturnObjectBuilder
  }

  setReturnObjectModel(name: string): ReturnObjectBuilder {
    const returnModel = new ReturnObjectBuilder(this.service, `${this.name}${pascal(name)}`, this.defaultLanguage);
    this.service.addOutputModel(returnModel);
    this.returnModel = returnModel;
    this.returnType = 'object';

    return returnModel;
  }

  getReturnScalarModel(): ReturnScalarBuilder {
    if (this.returnType !== 'scalar') {
      throw new Error(`Cant'return scalar return model, current return type: ${this.returnType}`);
    }

    return this.returnModel as ReturnScalarBuilder
  }

  setReturnScalarModel(): ReturnScalarBuilder {
    const returnModel = new ReturnScalarBuilder(`returnScalarFor${pascal(this.name)}MethodOf${pascal(this.service.name)}Service`, this.defaultLanguage);
    this.returnModel = returnModel;
    this.returnType = 'scalar';

    return returnModel;
  }

  getReturnVoidModel(): ReturnVoidBuilder {
    if (this.returnType !== 'void') {
      throw new Error(`Cant'return void return model, current return type: ${this.returnType}`);
    }

    return this.returnModel as ReturnVoidBuilder
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  setReturnVoidModel(name: string): ReturnVoidBuilder {
    const returnModel = new ReturnVoidBuilder(this.service);
    this.returnModel = returnModel;
    this.returnType = 'void';

    return returnModel;
  }

  setExportedToApi(exportedToApi = true) {
    this.exportedToApi = exportedToApi;

    return this
  }

  setMethodType(methodType: MethodType) {
    this.methodType = methodType;

    return this
  }

  setWorker(worker: string) {
    this.worker = worker;

    return this
  }

  resetWorker() {
    this.worker = undefined;

    return this
  }

  addRunSchedule(cronName: string) {
    if (this.runSchedule.some(c => c === cronName)) {
      throw new Error(`There is already cron "${cronName}" in schedule`)
    }

    this.runSchedule.push(cronName);

    return this
  }

  resetRunSchedule() {
    this.runSchedule = [];

    return this
  }

  setAsync(async = true) {
    this.async = async;

    return this
  }

  build(): ServiceMethod {
    return {
      ...super.build(),
      argsModel: this.argsModel.build(),
      returnModel: this.returnModel.build(),
      exportedToApi: this.exportedToApi,
      queable: this.queable,
      methodType: this.methodType,
      async: this.async,
    }
  }
}

export default MethodBuilder
