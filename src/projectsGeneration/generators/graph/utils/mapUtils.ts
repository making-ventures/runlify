import { TsModel } from '../../../builders/buildedTypes'
import { MappedName } from '../types';

export const findMappedName = (name: string, nameMapping: MappedName[]) => {
  const found = nameMapping.find(({original}) => original === name);

  if (!found) {
    throw new Error(`Can't find mapping for "${name}", original names: ${nameMapping.map(({original}) => original).join(', ')}`);
  }

  return found;
}

export const mapModelFeilds = (model: TsModel, modelNamesToMap: string[], nameMapping: MappedName[]) => ({
  ...model,
  fields: model.fields.map(f =>
    f.category === 'model' ?
    ({
      ...f,
      model: modelNamesToMap.includes(f.model) ? findMappedName(f.model, nameMapping).mapped: f.model,
    }) :
    f
  )
});

export const mapModelName = (model: TsModel, modelNamesToMap: string[], nameMapping: MappedName[]) => ({
  ...model,
  name: modelNamesToMap.includes(model.name) ? findMappedName(model.name, nameMapping).mapped: model.name,
});

export const mapModels = (models: TsModel[], modelNamesToMap: string[], nameMapping: MappedName[]) => models
  .map(model => mapModelFeilds(model, modelNamesToMap, nameMapping))
  .map(model => mapModelName(model, modelNamesToMap, nameMapping));
