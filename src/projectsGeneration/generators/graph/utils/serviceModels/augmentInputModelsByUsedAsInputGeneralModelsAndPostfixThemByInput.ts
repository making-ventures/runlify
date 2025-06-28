import {mapModels} from '../mapUtils';
import {MappedName, ServiceModels} from '../../types';
import {getUsedModels} from '../models/getUsedModels';


// Определяет, какие общие модели имеют ссылки во входных моделях, добавляем им постфикс `Input` и добавляем во входные модели
// соответствующим образом обновляя ссылки
// Модели, переданные как выходные и общие модели возвращает нетронутыми

export const augmentInputModelsByUsedAsInputGeneralModelsAndPostfixThemByInput =
  (models: ServiceModels): ServiceModels => {
    const {
      inputModels,
      outputModels,
      generalModels,
    } = models;

    const inputAndGeneralModels = [...inputModels, ...generalModels]
    const augmentedInputModels = inputModels.flatMap(m => getUsedModels(m, inputAndGeneralModels));
    const augmentedInputModelNames = augmentedInputModels.map(m => m.name);
    const generalModelsUsedInInput = generalModels.filter(m => augmentedInputModelNames.includes(m.name));

    const modelNamesToMap = generalModelsUsedInInput.map(m => m.name);
    const nameMapping: MappedName[] = generalModelsUsedInInput.map(m => ({
      original: m.name,
      mapped: `${m.name}Input`
    }));

    const inputModelsWithLinkedGeneral = [...inputModels, ...generalModelsUsedInInput];

    const mappedInputModels = mapModels(inputModelsWithLinkedGeneral, modelNamesToMap, nameMapping);

    return {
      inputModels: mappedInputModels,
      outputModels,
      generalModels,
    };
  }
