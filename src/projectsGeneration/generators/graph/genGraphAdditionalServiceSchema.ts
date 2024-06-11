import {
  GraphQLObjectType,
  GraphQLSchema,
} from 'graphql'
import {pascal} from '../../../utils/cases'
import {AdditionalService, MethodType} from '../../builders/buildedTypes'
import * as R from 'ramda'
import { genGraphArgsModelType, genGraphReturnModelType } from './genGraphModelType'
import { genGraphField } from './fields/genGraphField'

export const genGraphAdditionalServiceSchema = (service: AdditionalService) => {
  const mutations = service.methods.filter((method) => method.methodType === MethodType.Mutation);
  const queries = service.methods.filter((method) => method.methodType === MethodType.Query);

  const mutationConfig = {
    name: 'Mutation',
    fields: R.fromPairs(mutations.map(method => [
      `${service.name}${pascal(method.name)}`,
      {
        type: genGraphReturnModelType(method.returnModel),
        args: genGraphArgsModelType(method.argsModel),
      },
    ])),
  }

  const queryConfig = {
    name: 'Query',
    fields: R.fromPairs(queries.map(method => [
      `${service.name}${pascal(method.name)}`,
      {
        type: genGraphReturnModelType(method.returnModel),
        args: method.argsModel.fields.reduce((arg, curr) => {
          return {...arg, ...genGraphField(curr, 'entity')}
        }, {}),
      },
    ])),
  }

  const mutationType = new GraphQLObjectType(mutationConfig);
  const queryType = new GraphQLObjectType(queryConfig);

  const schema = new GraphQLSchema({
    mutation: mutationType,
    query: queryType,
  })

  return schema
}
