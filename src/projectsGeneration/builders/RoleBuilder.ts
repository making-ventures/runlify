import { Role } from './buildedTypes'
import BaseBuilder from './BaseBuilder'

class RoleBuilder extends BaseBuilder {
  registries: string[] = []

  constructor(name: string, defaultLanguage: string, title?: string) {
    super(name, defaultLanguage, title)
  }

  build(): Role {
    return {
      type: 'role',
      name: this.name,
      title: this.title,
      needFor: this.needFor,
      materialUiIcon: this.materialUiIcon,
    }
  }
}

export default RoleBuilder
