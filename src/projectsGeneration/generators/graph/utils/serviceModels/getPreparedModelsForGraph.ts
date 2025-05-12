import { AdditionalService } from '../../../../builders/buildedTypes'
import { getServiceModels } from './getServiceModels'
import { prefixServiceModelsWithServiceName } from './prefixServiceModelsWithServiceName'
import { augmentInputModelsByUsedAsInputGeneralModelsAndPostfixThemByInput } from './augmentInputModelsByUsedAsInputGeneralModelsAndPostfixThemByInput'
import { InputOutputArgsServiceModels } from '../../types'
import { pascal } from '../../../../../utils/cases'
import { removeUnusedInOutputGeneralModels } from './removeUnusedInOutputGeneralModels'
import { removeDublicatesFromServiceModels } from './removeDublicatesFromServiceModels'

export const getPreparedModelsForGraph = (service: AdditionalService): InputOutputArgsServiceModels => {
  const models = getServiceModels(service);

  const prefixedModels = prefixServiceModelsWithServiceName(service.name, models);
  const postfixedModels = augmentInputModelsByUsedAsInputGeneralModelsAndPostfixThemByInput(prefixedModels);

  const clearedFromUnusedGeneralModelsInOutput = removeUnusedInOutputGeneralModels(postfixedModels);

  const withoutDublicates = removeDublicatesFromServiceModels(clearedFromUnusedGeneralModelsInOutput);

  const argModelNames = service.methods.map(m => `${pascal(service.name)}${pascal(m.argsModel.name)}`);
  const args = withoutDublicates.inputModels.filter(m => argModelNames.includes(m.name));
  const clearedFromArgsInputs = withoutDublicates.inputModels.filter(m => !argModelNames.includes(m.name));

  const clearedFromArgsModels = {
    ...withoutDublicates,
    inputModels: clearedFromArgsInputs,
  };

  // const modelsWithoutVoids = removeVoidsInServiceModels(clearedFromArgsModels);

  const preparedModels = {
    ...clearedFromArgsModels,
    args,
  };

  return preparedModels;
}
