import {IntegrationClientQueryMethod} from '../buildedTypes'
import BaseBuilder from '../BaseBuilder'
import IntegrationClientArgsModelBuilder from './IntegrationClientArgsModelBuilder';
import IntegrationClientReturnModelBuilder from './IntegrationClientReturnModelBuilder';
import IntegrationClientBuilder from './IntegrationClientBuilder';

class IntegrationClientQueryMethodsBuilder extends BaseBuilder {
  protected client: IntegrationClientBuilder;
  protected argsModel: IntegrationClientArgsModelBuilder;
  protected returnModel: IntegrationClientReturnModelBuilder;

  constructor(client: IntegrationClientBuilder, name: string, defaultLanguage: string, title?: string) {
    super(name, defaultLanguage, {singular: title})
    
    this.client = client
    this.argsModel = new IntegrationClientArgsModelBuilder(client, name, defaultLanguage);
    this.returnModel = new IntegrationClientReturnModelBuilder(client, name, defaultLanguage);
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
