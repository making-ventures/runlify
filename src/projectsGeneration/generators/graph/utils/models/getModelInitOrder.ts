interface ModelToGetInitOrder {
  name: string;
  fields: string[];
}

const checkAllModelsPresented = (models: ModelToGetInitOrder[]) => {
  const modelNames = models.map(m => m.name);

  for (const model of models) {
    for (const field of model.fields) {
      if (!modelNames.includes(field)) {
        throw new Error(`Field of "${model.name}" model has link to "${field}" model that not presented. Models: ${modelNames.join(', ')}`);
      }
    }
  }
}

export const getModelInitOrder = (models: ModelToGetInitOrder[]): string[] => {
  const order: string[] = [];
  let currentModels = models.map(m => ({
    ...m,
    fields: m.fields.filter(f => f !== m.name), // clearing fields that links to model itself
  }));

  checkAllModelsPresented(currentModels);

  while (currentModels.length) {
    const hasModelsWithoutFields = currentModels.some(m => m.fields.length === 0);

    if (!hasModelsWithoutFields) {
      throw new Error(`Circular dependency detected. Models: ${currentModels.map(m => `"${m.name}": [${m.fields.join(', ')}]`).join(', ')}`);
    }

    for (const model of currentModels) {
      if (model.fields.length === 0) {
        order.push(model.name);
        currentModels = currentModels
          .filter(m => !order.includes(m.name))
          .map(m => ({
            ...m,
            fields: m.fields.filter(f => !order.includes(f))
          }));
      }
    }
  }

  return order;
}
