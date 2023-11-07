import {
  ModelField,
} from '../buildedTypes'
import BaseFieldBuilder from './BaseFieldBuilder'

class ModelFieldBuilder extends BaseFieldBuilder {
  protected model: string;
  protected array = false;

  constructor(
    model: string,
    name: string,
    defaultLanguage: string,
    title?: string
  ) {
    super(name, defaultLanguage, title)

    this.model = model;
  }

  setArray(array: boolean) {
    this.array = array;
  }

  build(): ModelField {
    const base = super.build()

    return {
      ...base,
      category: 'model',
      array: this.array,
      model: this.model,
    }
  }
}

export default ModelFieldBuilder;
