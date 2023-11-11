import {Permission, PermissionType} from './buildedTypes'
import BaseBuilder from './BaseBuilder'

class PermissionBuilder extends BaseBuilder {
  protected type: PermissionType;

  constructor(name: string, type: PermissionType, defaultLanguage: string, title?: string) {
    super(name, defaultLanguage, {singular: title})

    this.type = type;
  }

  setHasAllPermissions(type: PermissionType): PermissionBuilder {
    this.type = type;

    return this
  }

  build(): Permission {
    return {
      ...super.build(),
      type: 'permission',
      permissionType: this.type,
    }
  }
}

export default PermissionBuilder
