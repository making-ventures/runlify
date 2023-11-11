import BasePageBuilder from './BasePageBuilder'
import {ExternalPage, PageType} from './buildedTypes'

abstract class ExternalPageBuilder extends BasePageBuilder {
  protected url: string;

  constructor(url: string, defaultLanguage: string, title?: string) {
    super(url, defaultLanguage, title)

    this.url = url;
  }

  build(): ExternalPage {
    return {
      ...super.build(),
      type: 'page',
      pageType: PageType.External,
      url: this.url,
    }
  }
}

export default ExternalPageBuilder
