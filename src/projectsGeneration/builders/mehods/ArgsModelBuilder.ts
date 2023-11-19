import BaseModelBuilder from './BaseModelBuilder'
import {MethodsModelsHolder} from './MethodBuilder'

class ArgsModelBuilder extends BaseModelBuilder {
  constructor(service: MethodsModelsHolder, queryMethodName: string, defaultLanguage: string) {
    super(service, `${queryMethodName}Args`, `Основная модель результата ${service.name}`, defaultLanguage)
  }
}

export default ArgsModelBuilder
