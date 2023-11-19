import {ServiceMethod, MethodType} from '../buildedTypes'
import BaseBuilder from '../BaseBuilder'
import ArgsModelBuilder from './ArgsModelBuilder';
import ReturnModelBuilder from './ReturnModelBuilder';
import BaseModelBuilder from './BaseModelBuilder';

export interface MethodsModelsHolder {
  name: string
  getMethods: () => MethodBuilder[]
  getModels: () => BaseModelBuilder[]
}

class MethodBuilder extends BaseBuilder {
  protected service: MethodsModelsHolder;
  protected argsModel: ArgsModelBuilder;
  protected returnModel: ReturnModelBuilder;
  protected exportedToApi = false;
  protected queable = false;
  protected methodType: MethodType;
  protected worker?: string;
  protected runSchedule: string[] = [];

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
    this.returnModel = new ReturnModelBuilder(service, name, defaultLanguage);
    this.methodType = methodType;
  }

  getArgsModel(): ArgsModelBuilder {
    return this.argsModel
  }

  getReturnModel(): ReturnModelBuilder {
    return this.returnModel
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

  build(): ServiceMethod {
    return {
      ...super.build(),
      argsModel: this.argsModel.build(),
      returnModel: this.returnModel.build(),
      exportedToApi: this.exportedToApi,
      queable: this.queable,
      methodType: this.methodType,
    }
  }
}

export default MethodBuilder
