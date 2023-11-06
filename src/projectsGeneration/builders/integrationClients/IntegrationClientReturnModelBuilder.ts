import {IntegrationClientReturnModel} from '../buildedTypes'
import IntegrationClientBaseModelBuilder from './IntegrationClientBaseModelBuilder'

class IntegrationClientReturnModelBuilder extends IntegrationClientBaseModelBuilder {
  protected array = false;

  constructor(defaultLanguage: string) {
    super(defaultLanguage)
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
