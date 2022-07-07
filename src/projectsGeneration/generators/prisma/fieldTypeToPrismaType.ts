import { FiledType } from '../../builders/buildedTypes'

export const fieldTypeToPrismaType = (type: FiledType): string => {
  switch (type) {
    case 'int':
      return 'Int'
    case 'bigint':
      return 'BigInt'
    case 'float':
      return 'Float'
    case 'string':
      return 'String'
    case 'bool':
      return 'Boolean'
    case 'datetime':
      return 'DateTime'
    case 'date':
      return 'DateTime'
    default:
      throw new Error(`Unexpected "${type}" type`)
  }
}
