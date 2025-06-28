import {
  GraphQLBoolean,
  GraphQLFloat,
  GraphQLInt,
  GraphQLNamedInputType,
  GraphQLNamedOutputType,
  GraphQLString,
} from 'graphql'
import {GraphQLDateTime, GraphQLDate, GraphQLBigInt, GraphQLJSON} from 'graphql-scalars'
import {Field, ModelField} from '../../builders/buildedTypes'
import {GraphFieldPurpose} from './fields/genGraphField';

export const fieldTypeToGraphScalar = <T extends GraphQLNamedInputType | GraphQLNamedOutputType>(
  field: Field | ModelField,
  purpose: GraphFieldPurpose,
  externalTypes: T[] = [],
) => {
  if (field.category === 'model') {
    const typeName = field.model;
    const type = externalTypes.find(t => t.name === typeName);

    if (!type) {
      throw new Error(`Can't find "${typeName}" type. Types: ${externalTypes.map(t => t.name). join(', ')}.`);
    }

    return type;
  }

  switch (field.type) {
    case 'int':
      return GraphQLInt
    case 'bigint':
      return GraphQLBigInt
    case 'float':
      return GraphQLFloat
    case 'string':
      if ('stringType' in field && field.stringType == 'json') {
        return GraphQLJSON
      }
      return GraphQLString
    case 'bool':
      return GraphQLBoolean
    case 'datetime':
      return GraphQLDateTime
    case 'date':
      return GraphQLDate
    default:
      throw new Error(`Unexpected "${(field as any).type}" type`)
  }
}
