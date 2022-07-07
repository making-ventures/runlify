import { TKeyFieldType } from '../../builders/buildedTypes'

export const fieldIdTypeToPrismaType = (type: TKeyFieldType): string => {
  switch (type) {
    case 'bigint':
      return 'BigInt'
    case 'int':
      return 'Int'
    case 'string':
      return 'String'
    default:
      throw new Error(`Unexpected "${type}" type`)
  }
}
