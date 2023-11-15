import {AdditionalServiceMethod, AdditionalServiceMethodType} from '../buildedTypes'
import BaseBuilder from '../BaseBuilder'
import AdditionalServiceArgsModelBuilder from './AdditionalServiceArgsModelBuilder';
import AdditionalServiceReturnModelBuilder from './AdditionalServiceReturnModelBuilder';
import AdditionalServiceBuilder from './AdditionalServiceBuilder';

class AdditionalServiceMethodsBuilder extends BaseBuilder {
  protected client: AdditionalServiceBuilder;
  protected argsModel: AdditionalServiceArgsModelBuilder;
  protected returnModel: AdditionalServiceReturnModelBuilder;
  protected exportedToApi = false;
  protected methodType: AdditionalServiceMethodType;

  constructor(
    client: AdditionalServiceBuilder,
    name: string,
    methodType: AdditionalServiceMethodType,
    defaultLanguage: string,
    title?: string
  ) {
    super(name, defaultLanguage, {singular: title})
    
    this.client = client;
    this.argsModel = new AdditionalServiceArgsModelBuilder(client, name, defaultLanguage);
    this.returnModel = new AdditionalServiceReturnModelBuilder(client, name, defaultLanguage);
    this.methodType = methodType;
  }

  getArgsModel(): AdditionalServiceArgsModelBuilder {
    return this.argsModel
  }

  getReturnModel(): AdditionalServiceReturnModelBuilder {
    return this.returnModel
  }

  setExportedToApi(exportedToApi = true) {
    this.exportedToApi = exportedToApi;

    return this
  }

  setMethodType(methodType: AdditionalServiceMethodType) {
    this.methodType = methodType;

    return this
  }

  build(): AdditionalServiceMethod {
    return {
      ...super.build(),
      argsModel: this.argsModel.build(),
      returnModel: this.returnModel.build(),
      exportedToApi: this.exportedToApi,
      methodType: this.methodType,
    }
  }
}

export default AdditionalServiceMethodsBuilder
