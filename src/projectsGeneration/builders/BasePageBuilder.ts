import { BasePage } from './buildedTypes'
import BaseBuilder from './BaseBuilder'

abstract class BasePageBuilder extends BaseBuilder {
  constructor(name: string, defaultLanguage: string, title?: string) {
    super(name, defaultLanguage, {singular: title})
  }

  build(): BasePage {
    return {
      ...super.build(),
      type: 'page',
    }
  }
}

export default BasePageBuilder
