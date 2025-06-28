import {getUniqModels} from '../models/getUniqModels'
import {ServiceModels} from '../../types'

export const removeDublicatesFromServiceModels = (models: ServiceModels): ServiceModels => ({
  inputModels: getUniqModels(models.inputModels),
  outputModels: getUniqModels(models.outputModels),
  generalModels: getUniqModels(models.generalModels),
});
