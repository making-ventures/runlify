import SystemMetaBuilder from '../SystemMetaBuilder';
import {InternalMenuItem, MenuItemType} from '../buildedTypes'
import BaseMenuItemBuilder from './BaseMenuItemBuilder';

class InternalMenuItemBuilder extends BaseMenuItemBuilder {
  protected pageName: string;
  protected link: string;

  constructor(system: SystemMetaBuilder, pageName: string, label: string, defaultLanguage: string,  level?: number) {
    super(system, label, defaultLanguage, level);

    this.system.assurePageExists(pageName);
    const page = this.system.getPageByName(pageName);

    this.pageName = pageName;
    this.link = page.getLink();

    this.permissions = this.system.getPageByName(pageName).getRequiredPermission();
  }

  build(): InternalMenuItem {
    return {
      ...super.build(),
      itemType: MenuItemType.Internal,
      pageName: this.pageName,
      link: this.link,
    }
  }
}

export default InternalMenuItemBuilder
