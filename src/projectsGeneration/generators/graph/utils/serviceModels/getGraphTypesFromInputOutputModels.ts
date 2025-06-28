import {
  GraphQLInputObjectType,
  GraphQLNamedType,
  GraphQLObjectType,
} from 'graphql'
import {ModelField} from '../../../../builders/buildedTypes'
import {genGraphField} from '../../fields/genGraphField'
import {getModelInitOrder} from '../models/getModelInitOrder'
import {InputOutputServiceModels} from '../../types'

export const getGraphTypesFromInputOutputModels = (models: InputOutputServiceModels): GraphQLNamedType[] => {
  const allModels = [
    ...models.inputModels,
    ...models.outputModels,
  ];

  const modelsToGetInitOrder = allModels.map(m => ({
    name: m.name,
    fields: m.fields
      .filter(f => f.category === 'model')
      .map(f => (f as ModelField).model),
  }));

  const graphTypes: GraphQLNamedType[] = [];
  const order = getModelInitOrder(modelsToGetInitOrder);

  const inputModelNames = models.inputModels.map(m => m.name);

  for (const modelName of order) {
    const model = allModels.find(m => m.name === modelName);

    if (!model) {
      throw new Error(`Can't find "${modelName}" model. Models: ${allModels.map(m => m.name).join(', ')}`);
    }

    if (inputModelNames.includes(modelName)) {
      graphTypes.push(
        new GraphQLInputObjectType({
          name: model.name,
          fields: model.fields
            .reduce((acc, cur) => ({ ...acc, ...genGraphField(cur, 'input', graphTypes) }), {}),
        })
      );
    } else {
      graphTypes.push(
        new GraphQLObjectType({
          name: model.name,
          fields: model.fields
            .reduce((acc, cur) => ({ ...acc, ...genGraphField(cur, 'result', graphTypes) }), {}),
        })
      );
    }
  }

  return graphTypes
}
