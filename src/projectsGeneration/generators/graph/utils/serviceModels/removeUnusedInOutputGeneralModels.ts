import {getUsedModels} from '../models/getUsedModels'
import {getUniqModels} from '../models/getUniqModels'
import {ServiceModels} from '../../types'

export const removeUnusedInOutputGeneralModels = (models: ServiceModels): ServiceModels => {
  const generalModelsUsedInOutput = getUniqModels(
    models.outputModels.flatMap(out => getUsedModels(out, models.generalModels))
  );

  return {
    ...models,
    generalModels: generalModelsUsedInOutput,
  };
}
