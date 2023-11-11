import BasePageBuilder from './BasePageBuilder'
import {InternalPage, PageType} from './buildedTypes'

abstract class InternalPageBuilder extends BasePageBuilder {
  constructor(name: string, defaultLanguage: string, title?: string) {
    super(name, defaultLanguage, title)
  }

  build(): InternalPage {
    return {
      ...super.build(),
      type: 'page',
      pageType: PageType.Internal,
    }
  }
}

export default InternalPageBuilder
