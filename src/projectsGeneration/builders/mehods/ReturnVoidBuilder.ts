import {ServiceReturnType, AdditionalServiceVoidReturnModel} from '../buildedTypes';
import {MethodsModelsHolder} from './MethodBuilder';

class ReturnVoidBuilder  {
  protected service: MethodsModelsHolder;

  constructor(service: MethodsModelsHolder) {
    this.service = service
  }

  build(): AdditionalServiceVoidReturnModel {
    return {
      returnType: ServiceReturnType.Void,
    }
  }
}

export default ReturnVoidBuilder
