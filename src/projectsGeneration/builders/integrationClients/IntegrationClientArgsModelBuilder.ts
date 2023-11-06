import {IntegrationClientArgsModel} from '../buildedTypes'
import IntegrationClientBaseModelBuilder from './IntegrationClientBaseModelBuilder'

class IntegrationClientArgsModelBuilder extends IntegrationClientBaseModelBuilder {

  constructor(defaultLanguage: string) {
    super(defaultLanguage)
  }


  build(): IntegrationClientArgsModel {
    return {
      ...super.build(),
    }
  }
}

export default IntegrationClientArgsModelBuilder
