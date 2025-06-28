import {pascal} from '../../../../../utils/cases';
import {mapModels} from '../mapUtils';
import {MappedName, ServiceModels} from '../../types';

// Добалвяет моедлям префикс с именем сервиса, соответственно обновляет имена моделей, на котрые есть ссылка

export const prefixServiceModelsWithServiceName =
  (serviceName: string, models: ServiceModels): ServiceModels => {
    const {
      inputModels,
      outputModels,
      generalModels,
    } = models;

    const pascalServiceName = pascal(serviceName);

    const modelNamesToMap = [
      ...inputModels.map(m => m.name),
      ...outputModels.map(m => m.name),
      ...generalModels.map(m => m.name),
    ];
    const nameMapping: MappedName[] = [
      ...inputModels.map(m => ({
        original: m.name,
        mapped: `${pascalServiceName}${pascal(m.name)}`
      })),
      ...outputModels.map(m => ({
        original: m.name,
        mapped: `${pascalServiceName}${pascal(m.name)}`
      })),
      ...generalModels.map(m => ({
        original: m.name,
        mapped: `${pascalServiceName}${pascal(m.name)}`
      })),
    ];

    return {
      inputModels: mapModels(inputModels, modelNamesToMap, nameMapping),
      outputModels: mapModels(outputModels, modelNamesToMap, nameMapping),
      generalModels: mapModels(generalModels, modelNamesToMap, nameMapping),
    };
  }
