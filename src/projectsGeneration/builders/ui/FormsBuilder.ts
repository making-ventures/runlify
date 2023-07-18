import BaseSavableEntityBuilder from '../BaseSavableEntityBuilder'
import { Forms } from './Forms'
import { ListFormBuilder } from './ListFormBuilder'

export class FormsBuilder {
  getEntity: () => BaseSavableEntityBuilder
  listForm: ListFormBuilder

  constructor(getEntity: () => BaseSavableEntityBuilder) {
    this.getEntity = getEntity

    this.listForm = new ListFormBuilder(this.getEntity)
  }

  getListForm(): ListFormBuilder {
    return this.listForm
  }

  build(): Forms {
    return {
      listForm: this.listForm.build(),
    }
  }
}
