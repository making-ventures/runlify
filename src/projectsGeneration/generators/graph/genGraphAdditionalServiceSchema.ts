import {
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLSchema,
} from 'graphql'
import {pascal} from '../../../utils/cases'
import {AdditionalService, ScalarField} from '../../builders/buildedTypes'
import {GraphQLVoid} from 'graphql-scalars'
import * as R from 'ramda'
import { fieldTypeToGraphScalar } from './fieldTypeToGraphScalar'

export const genGraphAdditionalServiceSchema = (service: AdditionalService) => {
  const mutationConfig = {
    name: 'Mutation',
    fields: R.fromPairs(service.methods.map(method => [
      `${service.name}${pascal(method.name)}`,
      {
        type: GraphQLVoid,
        args:
          method.argsModel.fields.length ?
          R.fromPairs(method.argsModel.fields.map(f => [
            f.name,
            {
              type: f.requiredOnInput
              ? new GraphQLNonNull(fieldTypeToGraphScalar(f as ScalarField))
              : fieldTypeToGraphScalar(f as ScalarField),
            },
          ])) :
          undefined,
      },
    ])),
  }

  const mutationType = new GraphQLObjectType(mutationConfig)

  const schema = new GraphQLSchema({
    mutation: mutationType,
  })

  return schema
}
