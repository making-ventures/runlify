import {ModelField, TsModel} from '../../../../builders/buildedTypes'
import { getUniqModels } from './getUniqModels';
import * as R from 'ramda';

export const getUsedModels = (
  startingModel: TsModel,
  models: TsModel[],
  alreadyHandledModels: string[] = [],
): TsModel[] => {
  const modelNames = [startingModel.name];
  const innerAlreadyHandledModels = alreadyHandledModels || [];

  const modelFields = startingModel.fields.filter(f => f.category === 'model');
  const modelNamesFromFields = R.uniq(modelFields.map(f => (f as ModelField).model));

  for (const modelName of modelNamesFromFields) {

    if (innerAlreadyHandledModels.includes(modelName)) {
      continue;
    }

    const model = models.find(m => m.name === modelName);

    if (!model) {
      throw new Error(`Can't find model "${modelName}", models: ${models.map(m => m.name).join(', ')}`);
    }

    innerAlreadyHandledModels.push(modelName);

    if (modelName !== startingModel.name) {
      modelNames.push(...getUsedModels(model, models, innerAlreadyHandledModels).map(m => m.name));
    }
  }

  return getUniqModels(models.filter(m => modelNames.includes(m.name)));
};
