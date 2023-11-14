import * as R from 'ramda';
import SystemMetaBuilder from '../SystemMetaBuilder';
import {GroupMenuItem, MenuItemType} from '../buildedTypes'
import BaseMenuItemBuilder from './BaseMenuItemBuilder';
import ExternalMenuItemBuilder from './ExternalMenuItemBuilder';
import InternalMenuItemBuilder from './InternalMenuItemBuilder';

class GroupMenuItemBuilder extends BaseMenuItemBuilder {
  protected items: (GroupMenuItemBuilder | InternalMenuItemBuilder | ExternalMenuItemBuilder)[] = [];

  constructor(system: SystemMetaBuilder, label: string, defaultLanguage: string, level?: number) {
    super(system, label, defaultLanguage, level);
  }

  addGroupItem(label: string) {
    const menuItem = new GroupMenuItemBuilder(this.system, label, this.defaultLanguage, this.level + 1)

    this.items.push(menuItem)

    return menuItem
  }

  addInternalItem(pageName: string) {
    const menuItem = new InternalMenuItemBuilder(this.system, pageName, this.defaultLanguage, this.level + 1)

    this.items.push(menuItem)

    return menuItem
  }

  addExternalItem(label: string, url: string) {
    const menuItem = new ExternalMenuItemBuilder(this.system, label, url, this.defaultLanguage, this.level + 1)

    this.items.push(menuItem)

    return menuItem
  }

  build(): GroupMenuItem {
    const items = this.items.map(i => i.build());

    return {
      ...super.build(),
      itemType: MenuItemType.Group,
      items,
      permissions: R.uniq([
        ...this.permissions,
        ...items.flatMap(i => i.permissions),
      ]),
    }
  }
}

export default GroupMenuItemBuilder
