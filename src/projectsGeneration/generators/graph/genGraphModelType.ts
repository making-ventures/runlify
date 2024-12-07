import { GraphQLList, GraphQLNonNull, GraphQLObjectType } from 'graphql'
import { pascalSingular } from '../../../utils/cases'
import { AdditionalServiceArgsModel, AdditionalServiceReturnModel, ScalarField } from '../../builders/buildedTypes'
import { genGraphField } from './fields/genGraphField'
import { GraphQLVoid } from 'graphql-scalars'
import * as R from 'ramda'
import { fieldTypeToGraphScalar } from './fieldTypeToGraphScalar'

export const genGraphArgsModelType = (model: AdditionalServiceArgsModel) => {
  return model.fields.length ?
    R.fromPairs(model.fields.map(f => [
      f.name,
      {
        type: f.requiredOnInput
          ? new GraphQLNonNull(fieldTypeToGraphScalar(f as ScalarField))
          : fieldTypeToGraphScalar(f as ScalarField),
      },
    ])) :
    undefined
}

export const genGraphReturnModelType = (model: AdditionalServiceReturnModel) => {
  if (!model.fields.length) {
    return GraphQLVoid;
  }

  const objectType = new GraphQLObjectType({
    name: pascalSingular(model.name),
    fields: model.fields
      .filter((f) => !f.hidden)
      .reduce((acc, cur) => ({ ...acc, ...genGraphField(cur, 'entity') }), {}),
  })

  return model.array ? new GraphQLList(objectType) : objectType;
}
