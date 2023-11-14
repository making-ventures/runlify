import AdditionalServiceBaseModelBuilder from './AdditionalServiceBaseModelBuilder'
import AdditionalServiceBuilder from './AdditionalServiceBuilder'

class AdditionalServiceArgsModelBuilder extends AdditionalServiceBaseModelBuilder {
  constructor(client: AdditionalServiceBuilder, queryMethodName: string, defaultLanguage: string) {
    super(client, `${queryMethodName}Args`, `Основная модель результата ${client.name}`, defaultLanguage)
  }
}

export default AdditionalServiceArgsModelBuilder
