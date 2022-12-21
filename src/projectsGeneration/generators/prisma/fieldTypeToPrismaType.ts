import { Field, StringField } from '../../builders/buildedTypes'

export const fieldTypeToPrismaType = (field: Field): string => {
  switch (field.type) {
    case 'int':
      return 'Int'
    case 'bigint':
      return 'BigInt'
    case 'float':
      return 'Float'
    case 'string':
      if ((field as StringField).stringType === 'json') {
        return 'Json'
      }
      return 'String'
    case 'bool':
      return 'Boolean'
    case 'datetime':
      return 'DateTime'
    case 'date':
      return 'DateTime'
    default:
      throw new Error(`Unexpected "${(field as any).type}" type`)
  }
}
