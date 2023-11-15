import {
  GraphQLObjectType,
  GraphQLSchema,
} from 'graphql'
import {pascalSingular} from '../../../utils/cases'
import {AdditionalService} from '../../builders/buildedTypes'
import {GraphQLVoid} from 'graphql-scalars'
import * as R from 'ramda'

export const genGraphAdditionalServiceSchema = (service: AdditionalService) => {
  const mutationConfig = {
    name: 'Mutation',
    fields: R.fromPairs(service.methods.map(method => [`${service.name}${pascalSingular(method.name)}`, {type: GraphQLVoid}])),
  }

  const mutationType = new GraphQLObjectType(mutationConfig)

  const schema = new GraphQLSchema({
    mutation: mutationType,
  })

  return schema
}
