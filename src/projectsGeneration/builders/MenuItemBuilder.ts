import { MenuItem } from './buildedTypes'
import BaseBuilder from './BaseBuilder'

class MenuItemBuilder extends BaseBuilder {
  protected level = 1;
  protected items: MenuItemBuilder[] = [];

  constructor(name: string, defaultLanguage: string, title?: string, level?: number) {
    super(name, defaultLanguage, {singular: title});

    if (level && level > 2) {
      throw new Error(`You trying to create menu item on "${level}" level. Maximum level is 2`);
    }

    if (level) {
      this.level = level;
    }
  }

  addItem(name: string, defaultLanguage: string, title?: string): MenuItemBuilder {
    const item = new MenuItemBuilder(name, defaultLanguage, title, this.level + 1);

    this.items.push(item);

    return item;
  }

  build(): MenuItem {
    return {
      ...super.build(),
      type: 'menuItem',
    }
  }
}

export default MenuItemBuilder
