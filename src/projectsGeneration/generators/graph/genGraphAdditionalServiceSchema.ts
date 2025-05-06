import {GraphQLNamedOutputType, GraphQLNamedType, GraphQLObjectType, GraphQLSchema} from 'graphql'
import {pascal} from '../../../utils/cases'
import {AdditionalService, MethodType, TsModel} from '../../builders/buildedTypes'
import * as R from 'ramda'
import { GraphQLVoid } from 'graphql-scalars'
import { genGraphArgsModelType } from './genGraphModelType'
import { getPreparedModelsForGraph } from './utils/serviceModels/getPreparedModelsForGraph'
import { getGraphTypesFromInputOutputModels } from './utils/serviceModels/getGraphTypesFromInputOutputModels'

const findGraphTypeByName = (serviceName: string, typeName: string, types: GraphQLNamedType[]) => {
  const prefixedName = `${pascal(serviceName)}${pascal(typeName)}`;
  const found = types.find(t => t.name === prefixedName);

  if (!found) {
    throw new Error(`Can't find "${prefixedName}" type, available types: ${types.map(t => t.name).join(', ')}`);
  }

  return found;
}

const findModelByName = (serviceName: string, typeName: string, types: TsModel[]) => {
  const prefixedName = `${pascal(serviceName)}${pascal(typeName)}`;
  const found = types.find(t => t.name === prefixedName);

  if (!found) {
    throw new Error(`Can't find "${prefixedName}" model, available models: ${types.map(t => t.name).join(', ')}`);
  }

  return found;
}

export const genGraphAdditionalServiceSchema = (service: AdditionalService) => {
  const {methods} = service;
  const queries = methods.filter((method) => method.methodType === MethodType.Query);
  const mutations = methods.filter((method) => method.methodType === MethodType.Mutation);

  const models = getPreparedModelsForGraph(service);
  const types = getGraphTypesFromInputOutputModels(models);

  const mutationConfig = {
    name: 'Mutation',
    fields: R.fromPairs(mutations.map(method => [
      `${service.name}${pascal(method.name)}`,
      {
        args: genGraphArgsModelType(
          findModelByName(service.name, method.argsModel.name, models.args),
          types,
        ),
        type: method.returnModel.fields.length
          ? findGraphTypeByName(service.name, method.returnModel.name, types) as GraphQLNamedOutputType
          : GraphQLVoid,
      },
    ])),
  }

  const queryConfig = {
    name: 'Query',
    fields: R.fromPairs(queries.map(method => [
      `${service.name}${pascal(method.name)}`,
      {
        args: genGraphArgsModelType(
          findModelByName(service.name, method.argsModel.name, models.args),
          types,
        ),
        type: method.returnModel.fields.length
          ? findGraphTypeByName(service.name, method.returnModel.name, types) as GraphQLNamedOutputType
          : GraphQLVoid,
      },
    ])),
  }

  const mutationType = new GraphQLObjectType(mutationConfig);
  const queryType = new GraphQLObjectType(queryConfig);

  const schema = new GraphQLSchema({
    mutation: mutationType,
    query: queryType,
    types,
  })

  return schema
}
