import SystemMetaBuilder from '../SystemMetaBuilder';
import {ExternalMenuItem, MenuItemType} from '../buildedTypes'
import BaseMenuItemBuilder from './BaseMenuItemBuilder';

class ExternalMenuItemBuilder extends BaseMenuItemBuilder {
  protected link: string;

  constructor(system: SystemMetaBuilder, label: string, link: string, defaultLanguage: string, level?: number) {
    super(system, label, defaultLanguage, level);
  
    this.link = link;
  }

  build(): ExternalMenuItem {
    return {
      ...super.build(),
      itemType: MenuItemType.External,
      link: this.link,
    }
  }
}

export default ExternalMenuItemBuilder
