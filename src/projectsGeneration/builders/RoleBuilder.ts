import { Role } from './buildedTypes'
import BaseBuilder from './BaseBuilder'

class RoleBuilder extends BaseBuilder {
  protected hasAllPermissions = false;

  constructor(name: string, defaultLanguage: string, title?: string) {
    super(name, defaultLanguage, {singular: title})
  }

  setHasAllPermissions(hasAllPermissions: boolean): RoleBuilder {
    this.hasAllPermissions = hasAllPermissions;

    return this
  }

  build(): Role {
    return {
      ...super.build(),
      type: 'role',
    }
  }
}

export default RoleBuilder
