import BaseSavableEntityBuilder from '../BaseSavableEntityBuilder'
import { ListForm } from './Forms'
import { ListFormFilterBuilder } from './ListFormFilterBuilder'

export class ListFormBuilder {
  getEntity: () => BaseSavableEntityBuilder
  filter: ListFormFilterBuilder

  constructor(getEntity: () => BaseSavableEntityBuilder) {
    this.getEntity = getEntity

    this.filter = new ListFormFilterBuilder(this.getEntity)
  }

  getFilter(): ListFormFilterBuilder {
    return this.filter
  }

  build(): ListForm {
    return {
      filter: this.filter.build(),
    }
  }
}
