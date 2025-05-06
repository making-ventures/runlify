import { TsModel } from '../../../../builders/buildedTypes'
import { ServiceModels } from '../../types'

const clearFromVoids = (models: TsModel[]) => models
.filter(m => m.fields.length);

export const removeVoidsInServiceModels = (models: ServiceModels): ServiceModels => ({
  inputModels: clearFromVoids(models.inputModels),
  outputModels: clearFromVoids(models.outputModels),
  generalModels: clearFromVoids(models.generalModels),
});
