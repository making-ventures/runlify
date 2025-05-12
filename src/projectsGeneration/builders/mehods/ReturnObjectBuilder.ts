import {AdditionalServiceObjectReturnModel, ServiceReturnType} from '../buildedTypes'
import BaseModelBuilder from './BaseModelBuilder'
import {MethodsModelsHolder} from './MethodBuilder';

class ReturnObjectBuilder extends BaseModelBuilder {
  protected array = false;

  constructor(service: MethodsModelsHolder, methodName: string, defaultLanguage: string) {
    super(service, methodName, `Основная модель результата ${service.name}`, defaultLanguage)
  }

  setArray(array: boolean = true) {
    this.array = array;
  }

  build(): AdditionalServiceObjectReturnModel {
    return {
      ...super.build(),
      returnType: ServiceReturnType.Object,
      array: this.array,
    }
  }
}

export default ReturnObjectBuilder
