import { Field } from '../../../../builders/buildedTypes'

export const genPrismaDefault = (field: Field): string => {
  if (!field.defaultDbValue) {
    return ''
  }

  return `@default(${field.defaultDbValue})`
}
