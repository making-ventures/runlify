import { FieldType } from '../../../../builders/buildedTypes'
import { EditComponentName } from '../types'

export const getCompNameToEditScalar = (type: FieldType): EditComponentName => {
  switch (type) {
    case 'string':
      return 'TextInput'
    case 'int':
      return 'NumberInput'
    case 'bigint':
      return 'NumberInput'
    case 'float':
      return 'NumberInput'
    case 'bool':
      return 'BooleanInput'
    case 'datetime':
      return 'DateTimeInput'
    case 'date':
      return 'DateInput'
    default:
      throw new Error(`Unexpected "${type}" type`)
  }
}
