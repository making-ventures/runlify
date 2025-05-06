import {AdditionalServiceReturnModel} from '../buildedTypes'
import BaseModelBuilder from './BaseModelBuilder'
import {MethodsModelsHolder} from './MethodBuilder';

class ReturnModelBuilder extends BaseModelBuilder {
  protected array = false;

  constructor(service: MethodsModelsHolder, methodName: string, defaultLanguage: string) {
    super(service, `${methodName}Result`, `Основная модель результата ${service.name}`, defaultLanguage)
  }

  setArray(array: boolean) {
    this.array = array;
  }

  build(): AdditionalServiceReturnModel {
    return {
      ...super.build(),
      array: this.array,
    }
  }
}

export default ReturnModelBuilder
