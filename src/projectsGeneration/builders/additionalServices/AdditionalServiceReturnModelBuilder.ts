import {AdditionalServiceReturnModel} from '../buildedTypes'
import AdditionalServiceBaseModelBuilder from './AdditionalServiceBaseModelBuilder'
import AdditionalServiceBuilder from './AdditionalServiceBuilder';

class AdditionalServiceReturnModelBuilder extends AdditionalServiceBaseModelBuilder {
  protected array = false;

  constructor(client: AdditionalServiceBuilder, queryMethodName: string, defaultLanguage: string) {
    super(client, `${queryMethodName}Model`, `Основная модель результата ${client.name}`, defaultLanguage)
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

export default AdditionalServiceReturnModelBuilder
