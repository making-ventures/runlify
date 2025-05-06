import { AdditionalService } from '../../../../builders/buildedTypes'
import { getUsedModels } from '../models/getUsedModels'
import { getUniqModels } from '../models/getUniqModels'
import { ServiceModels } from '../../types';

// Возвращает используемые сервисом модели

export const getUsedModelsForService =
  (service: AdditionalService): ServiceModels => {
    const {inputModels, outputModels, generalModels} = service;

    const generalInputModels = [
      ...generalModels,
      ...inputModels,
    ];

    const generalOtputModels = [
      ...generalModels,
      ...outputModels,
    ];

    const usedInputModels = getUniqModels(
      service.methods.flatMap(q => getUsedModels(q.argsModel, generalInputModels))
    );

    const usedOutputModels = getUniqModels(
      service.methods.flatMap(q => getUsedModels(q.returnModel, generalOtputModels))
    );

    const usedInputModelNames = usedInputModels.map(m => m.name);
    const usedOutputModelNames = usedOutputModels.map(m => m.name);

    return {
      inputModels: usedInputModels,
      outputModels: usedOutputModels,
      generalModels: generalModels.filter(
        m => usedInputModelNames.includes(m.name) || usedOutputModelNames.includes(m.name)
      ),
    };
  }
