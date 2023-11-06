import {IntegrationClientQueryMethod} from '../buildedTypes'
import BaseBuilder from '../BaseBuilder'
import IntegrationClientArgsModelBuilder from './IntegrationClientArgsModelBuilder';
import IntegrationClientReturnModelBuilder from './IntegrationClientReturnModelBuilder';

class IntegrationClientQueryMethodsBuilder extends BaseBuilder {
  protected argsModel: IntegrationClientArgsModelBuilder;
  protected returnModel: IntegrationClientReturnModelBuilder;

  constructor(name: string, defaultLanguage: string, title?: string) {
    super(name, defaultLanguage, {singular: title})
    
    this.argsModel = new IntegrationClientArgsModelBuilder(defaultLanguage);
    this.returnModel = new IntegrationClientReturnModelBuilder(defaultLanguage);
  }

  getArgsModel(): IntegrationClientArgsModelBuilder {
    return this.argsModel
  }

  getReturnModel(): IntegrationClientReturnModelBuilder {
    return this.returnModel
  }

  build(): IntegrationClientQueryMethod {
    return {
      ...super.build(),
      argsModel: this.argsModel.build(),
      returnModel: this.returnModel.build(),
    }
  }
}

export default IntegrationClientQueryMethodsBuilder
