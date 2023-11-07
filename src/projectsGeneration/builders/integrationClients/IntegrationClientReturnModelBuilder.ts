import {IntegrationClientReturnModel} from '../buildedTypes'
import IntegrationClientBaseModelBuilder from './IntegrationClientBaseModelBuilder'
import IntegrationClientBuilder from './IntegrationClientBuilder';

class IntegrationClientReturnModelBuilder extends IntegrationClientBaseModelBuilder {
  protected array = false;

  constructor(client: IntegrationClientBuilder, defaultLanguage: string) {
    super(client, `${client.name}Model`, `Основная модель результата ${client.name}`, defaultLanguage)
  }

  setArray(array: boolean) {
    this.array = array;
  }

  build(): IntegrationClientReturnModel {
    return {
      ...super.build(),
      array: this.array,
    }
  }
}

export default IntegrationClientReturnModelBuilder
