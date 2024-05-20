import SystemMetaBuilder from '../SystemMetaBuilder';
import {ExternalMenuItem, MenuItemType} from '../buildedTypes'
import BaseMenuItemBuilder from './BaseMenuItemBuilder';

class ExternalMenuItemBuilder extends BaseMenuItemBuilder {
  protected link: string;
  protected envVarConfig: boolean;

  constructor(system: SystemMetaBuilder, label: string, link: string, defaultLanguage: string, level?: number, envVarConfig?: boolean) {
    super(system, label, defaultLanguage, level);
  
    this.link = link;
    this.envVarConfig = envVarConfig !== undefined ? envVarConfig : false;
  }

  build(): ExternalMenuItem {
    return {
      ...super.build(),
      itemType: MenuItemType.External,
      link: this.link,
      envVarConfig: this.envVarConfig,
    }
  }
}

export default ExternalMenuItemBuilder
