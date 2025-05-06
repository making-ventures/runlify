import {
  ModelField,
} from '../buildedTypes'
import BaseFieldBuilder from './BaseFieldBuilder'

class ModelFieldBuilder extends BaseFieldBuilder {
  protected service: string;
  protected model: string;
  protected array = false;
  protected category: 'model' = 'model';

  constructor(
    service: string,
    model: string,
    name: string,
    defaultLanguage: string,
    title?: string
  ) {
    super(name, defaultLanguage, title)

    this.service = service;
    this.model = model;
  }

  setArray(array: boolean) {
    this.array = array;

    return this;
  }

  getModel() {
    return this.model;
  }

  build(): ModelField {
    const base = super.build()

    return {
      ...base,
      category: this.category,
      array: this.array,
      model: this.model,
      service: this.service,
    }
  }
}

export default ModelFieldBuilder;
