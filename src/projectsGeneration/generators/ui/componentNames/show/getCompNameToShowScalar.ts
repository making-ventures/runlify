import { FiledType } from '../../../../builders/buildedTypes'
import { ShowComponentName } from '../types'

export const getCompNameToShowScalar = (type: FiledType): ShowComponentName => {
  switch (type) {
    case 'string':
      return 'TextField'
    case 'int':
      return 'NumberField'
    case 'bigint':
      return 'NumberField'
    case 'float':
      return 'NumberField'
    case 'bool':
      return 'BooleanField'
    case 'datetime':
      return 'DateField'
    case 'date':
      return 'DateField'
    default:
      throw new Error(`Unexpected "${type}" type`)
  }
}
