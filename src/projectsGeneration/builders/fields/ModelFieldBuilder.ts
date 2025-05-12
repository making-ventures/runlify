import {
  ModelField,
} from '../buildedTypes'
import BaseFieldBuilder from './BaseFieldBuilder'

class ModelFieldBuilder extends BaseFieldBuilder {
  protected service: string;
  protected model: string;
  protected category: 'model' = 'model' as const;

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

  getModel() {
    return this.model;
  }

  build(): ModelField {
    const base = super.build()

    return {
      ...base,
      category: this.category,
      model: this.model,
      service: this.service,
    }
  }
}

export default ModelFieldBuilder;
