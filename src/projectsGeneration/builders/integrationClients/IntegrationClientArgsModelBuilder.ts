import IntegrationClientBaseModelBuilder from './IntegrationClientBaseModelBuilder'
import IntegrationClientBuilder from './IntegrationClientBuilder'

class IntegrationClientArgsModelBuilder extends IntegrationClientBaseModelBuilder {
  constructor(client: IntegrationClientBuilder, queryMethodName: string, defaultLanguage: string) {
    super(client, `${queryMethodName}Args`, `Основная модель результата ${client.name}`, defaultLanguage)
  }
}

export default IntegrationClientArgsModelBuilder
