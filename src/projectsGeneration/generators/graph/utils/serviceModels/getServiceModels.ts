import {AdditionalService} from '../../../../builders/buildedTypes'
import {ServiceModels} from '../../types';
import {getUsedModelsForService} from './getUsedModelsForService';

export const getServiceModels = (service: AdditionalService): ServiceModels => {
    const {
      inputModels,
      outputModels,
      generalModels,
    } = getUsedModelsForService(service);

    return {
      inputModels,
      outputModels,
      generalModels,
    };
  }
