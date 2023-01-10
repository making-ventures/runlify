import { Role } from './buildedTypes'
import BaseBuilder from './BaseBuilder'

class RoleBuilder extends BaseBuilder {
  registries: string[] = []

  constructor(name: string, defaultLanguage: string, title?: string) {
    super(name, defaultLanguage, {singular: title, plural: title})
  }

  build(): Role {
    return {
      ...super.build(),
      type: 'role',
    }
  }
}

export default RoleBuilder
