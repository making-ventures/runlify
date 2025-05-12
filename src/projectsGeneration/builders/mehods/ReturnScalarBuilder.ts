import {AdditionalServiceScalarReturnModel, ServiceReturnType} from '../buildedTypes'
import ScalarFieldBuilder from '../fields/ScalarFieldBuilder';

class ReturnScalarBuilder extends ScalarFieldBuilder {
  constructor(name: string, defaultLanguage: string) {
    super(name, defaultLanguage)
  }

  build(): AdditionalServiceScalarReturnModel {
    return {
      ...super.build(),
      returnType: ServiceReturnType.Scalar,
      array: this.array,
    }
  }
}

export default ReturnScalarBuilder
