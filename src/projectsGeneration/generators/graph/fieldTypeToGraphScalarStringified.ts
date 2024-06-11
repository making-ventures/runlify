import {Field} from '../../builders/buildedTypes'

const fieldTypeToGraphScalarStringifiedPlain = (field: Field) => {
  switch (field.type) {
    case 'int':
      return 'GraphQLInt'
    case 'bigint':
      return 'GraphQLBigInt'
    case 'float':
      return 'GraphQLFloat'
    case 'string':
      if ('stringType' in field && field.stringType == 'json') {
        return 'JSON'
      }
      return 'String'
    case 'bool':
      return 'GraphQLBoolean'
    case 'datetime':
      return 'GraphQLDateTime'
    case 'date':
      return 'GraphQLDate'
    default:
      throw new Error(`Unexpected "${(field as any).type}" type`)
  }
}

const fieldTypeToGraphScalarStringified = (field: Field) =>
field.required ? fieldTypeToGraphScalarStringifiedPlain(field) + '!' : fieldTypeToGraphScalarStringifiedPlain(field);

export default fieldTypeToGraphScalarStringified;
