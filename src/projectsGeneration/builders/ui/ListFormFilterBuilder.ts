import BaseSavableEntityBuilder from '../BaseSavableEntityBuilder'
import { ListFormFilter } from './Forms'
import { ListFormFilterFieldBuilder } from './ListFormFilterFieldBuilder'

export class ListFormFilterBuilder {
  getEntity: () => BaseSavableEntityBuilder
  fields: ListFormFilterFieldBuilder[]

  constructor(getEntity: () => BaseSavableEntityBuilder) {
    this.getEntity = getEntity

    this.fields = this.getEntity()
      .getFileds()
      .filter(f => f.showInFilter)
      .map(
        (field) => new ListFormFilterFieldBuilder(this.getEntity, () => field)
      )
  }

  getField(name: string): ListFormFilterFieldBuilder {
    const field = this.fields.find((f) => f.getField().name === name)
    if (!field) {
      throw new Error(`There is no fiel with "${name}" name`)
    }

    return field
  }

  build(): ListFormFilter {
    return {
      fields: this.fields.map((fileld) => fileld.build()),
    }
  }
}
