import BaseBuilder from '../BaseBuilder';
import {TsModel} from '../buildedTypes'
import ModelFieldBuilder from '../fields/ModelFieldBuilder'
import ScalarFieldBuilder from '../fields/ScalarFieldBuilder'
import AdditionalServiceBuilder from './AdditionalServiceBuilder';

class AdditionalServiceBaseModelBuilder extends BaseBuilder {
  protected client: AdditionalServiceBuilder;
  protected fields: (ScalarFieldBuilder | ModelFieldBuilder)[] = []

  constructor(client: AdditionalServiceBuilder, name: string, title: string, defaultLanguage: string) {
    super(name, defaultLanguage, {singular: title})

    this.client = client
  }

  addField(
    name: string,
    title?: string,
  ): ScalarFieldBuilder {
    if (this.fields.some((f) => f.name === name)) {
      throw new Error(`There is already field with name "${name}" in args model`)
    }

    const field = new ScalarFieldBuilder(name, this.defaultLanguage, title)
    this.fields.push(field)

    return field
  }

  addModelField(
    model: string,
    name: string,
    title?: string
  ): ModelFieldBuilder {
    if (this.fields.some((f) => f.name === name)) {
      throw new Error(`There is already field with name "${name}" in args model`)
    }
    
    if (!this.client.models.some((f) => f.name === model)) {
      throw new Error(`There is no model with name "${model}" in "${this.client.name}"`)
    }

    const field = new ModelFieldBuilder(model, name, this.defaultLanguage, title)

    this.fields.push(field)

    return field
  }

  delField(name: string) {
    this.fields = this.fields.filter((f) => f.name !== name)

    return this
  }

  build(): TsModel {
    return {
      ...super.build(),
      fields: this.fields.map((field) => field.build()),
    }
  }
}

export default AdditionalServiceBaseModelBuilder
