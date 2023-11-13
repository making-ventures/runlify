import {BaseMenuItem} from '../buildedTypes'
import BaseBuilder from '../BaseBuilder'
import SystemMetaBuilder from '../SystemMetaBuilder';

abstract class BaseMenuItemBuilder extends BaseBuilder {
  protected system: SystemMetaBuilder;
  protected level = 1;
  protected label: string;
  protected debugOnly = false;
  protected permissions: string[] = [];

  constructor(system: SystemMetaBuilder, label: string, defaultLanguage: string, level?: number) {
    super(label, defaultLanguage, {singular: label});

    this.label = label;
    this.system = system;

    if (level && level > 2) {
      throw new Error(`You trying to create menu item on "${level}" level. Maximum level is 2`);
    }

    if (level) {
      this.level = level;
    }
  }

  setLabel(label: string) {
    this.label = label;
  }

  setDebugOnly(debugOnly = true) {
    this.debugOnly = debugOnly;
  }

  addRequiredPermission(permission: string) {
    if (this.permissions.some(p => p === permission)) {
      throw new Error(`Permission "${permission}" already recuired for "${this.name}" menu item`);
    }

    this.permissions.push(permission);
  }

  build(): BaseMenuItem {
    return {
      ...super.build(),
      type: 'menuItem',
      label: this.label,
      debugOnly: this.debugOnly,
      permissions: this.permissions,
    }
  }
}

export default BaseMenuItemBuilder
