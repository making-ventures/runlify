import SystemMetaBuilder from '../SystemMetaBuilder';
import {ExternalEnvMenuItem, MenuItemType} from '../buildedTypes'
import BaseMenuItemBuilder from './BaseMenuItemBuilder';

class ExternalEnvMenuItemBuilder extends BaseMenuItemBuilder {
  protected env: string;

  constructor(system: SystemMetaBuilder, label: string, env: string, defaultLanguage: string, level?: number) {
    super(system, label, defaultLanguage, level);
  
    this.env = env;
  }

  build(): ExternalEnvMenuItem {
    return {
      ...super.build(),
      itemType: MenuItemType.ExternalEnv,
      env: this.env,
    }
  }
}

export default ExternalEnvMenuItemBuilder
