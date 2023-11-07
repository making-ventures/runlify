import {IntegrationClientArgsModel} from '../buildedTypes'
import IntegrationClientBaseModelBuilder from './IntegrationClientBaseModelBuilder'
import IntegrationClientBuilder from './IntegrationClientBuilder'

class IntegrationClientArgsModelBuilder extends IntegrationClientBaseModelBuilder {

  constructor(client: IntegrationClientBuilder, defaultLanguage: string) {
    super(client, `${client.name}Model`, `Основная модель результата ${client.name}`, defaultLanguage)
  }

  build(): IntegrationClientArgsModel {
    return {
      ...super.build(),
    }
  }
}

export default IntegrationClientArgsModelBuilder
