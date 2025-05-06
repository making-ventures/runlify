import { AdditionalService } from '../../../../builders/buildedTypes'
import { InputOutputServiceModels } from '../../types';
import { getUsedModelsForService } from './getUsedModelsForService';

export const getUsedGraphModelsForService =
  (service: AdditionalService): InputOutputServiceModels => {
    const {
      inputModels,
      outputModels,
    } = getUsedModelsForService(service);

    return {
      inputModels: inputModels
        .filter(model => !service.methods.some(method => method.argsModel.name === model.name)),
      outputModels,
    };
  }
