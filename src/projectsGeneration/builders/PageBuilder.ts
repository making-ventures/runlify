import {Page} from './buildedTypes'
import BaseBuilder from './BaseBuilder'

class PageBuilder extends BaseBuilder {
  protected link: string;
  protected permissions: string[] = [];

  constructor(name: string, link: string, defaultLanguage: string, title?: string) {
    super(name, defaultLanguage, {singular: title})

    this.link = link;
  }

  addRequiredPermission(permission: string) {
    if (this.permissions.some(p => p === permission)) {
      throw new Error(`Permission "${permission}" already recuired for "${this.name}" menu item`);
    }

    this.permissions.push(permission);

    return this;
  }

  getRequiredPermission() {
    return this.permissions;
  }

  getLink() {
    return this.link;
  }

  build(): Page {
    return {
      ...super.build(),
      type: 'page',
      link: this.link,
    }
  }
}

export default PageBuilder
