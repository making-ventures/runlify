import {
  GraphQLFieldConfigArgumentMap,
  GraphQLList,
  GraphQLNamedType,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLScalarType,
} from 'graphql'
import { pascalSingular } from '../../../utils/cases'
import {
  AdditionalService,
  AdditionalServiceArgsModel,
  AdditionalServiceObjectReturnModel,
  ScalarField,
} from '../../builders/buildedTypes'
import { genGraphField } from './fields/genGraphField'
import { GraphQLVoid } from 'graphql-scalars'
import * as R from 'ramda'
import { fieldTypeToGraphScalar } from './fieldTypeToGraphScalar'

export const genGraphArgsModelType = (
  model: AdditionalServiceArgsModel,
  externalTypes: GraphQLNamedType[],
): GraphQLFieldConfigArgumentMap | undefined => {
  return model.fields.length ?
    R.fromPairs(model.fields.map(f => [
      f.name,
      {
        type: f.requiredOnInput
          ? new GraphQLNonNull(fieldTypeToGraphScalar(f as ScalarField, 'input', externalTypes) as GraphQLScalarType)
          : fieldTypeToGraphScalar(f as ScalarField, 'input', externalTypes) as GraphQLScalarType,
      },
    ])) :
    undefined
}

export const genGraphReturnModelType_ = (
  service: AdditionalService,
  model: AdditionalServiceObjectReturnModel,
  types: GraphQLNamedType[] = [],
) => {
  if (!model.fields.length) {
    return GraphQLVoid;
  }

  const objectType = new GraphQLObjectType({
    name: `${pascalSingular(service.name)}${pascalSingular(model.name)}`,
    fields: model.fields
      .filter((f) => !f.hidden)
      .reduce((acc, cur) => ({ ...acc, ...genGraphField(cur, 'result', types) }), {}),
  })

  return model.array ? new GraphQLList(objectType) : objectType;
}
