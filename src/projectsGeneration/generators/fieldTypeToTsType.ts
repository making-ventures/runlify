import { FiledType, TsTypes } from '../builders/buildedTypes'

export const fieldTypeToTsType = (type: FiledType) => {
  switch (type) {
    case 'int':
      return TsTypes.Number
    case 'bigint':
      return TsTypes.BigInt
    case 'float':
      return TsTypes.Number
    case 'string':
      return TsTypes.String
    case 'bool':
      return TsTypes.Boolean
    case 'datetime':
      return TsTypes.Date
    case 'date':
      return TsTypes.Date
    default:
      throw new Error(`Unexpected "${type}" type`)
  }
}
