import {FieldBuilder} from '../types'
import BaseSavableEntityBuilder from '../BaseSavableEntityBuilder'
import {ListFormFilterField} from './Forms'

class ListFormFilterFieldBuilder {
  getEntity: () => BaseSavableEntityBuilder
  getField: () => FieldBuilder
  alwaysOn = false

  constructor(
    getEntity: () => BaseSavableEntityBuilder,
    getField: () => FieldBuilder
  ) {
    this.getEntity = getEntity
    this.getField = getField
  }

  setAlwaysOn(alwaysOn: boolean) {
    this.alwaysOn = alwaysOn

    return this
  }

  build(): ListFormFilterField {
    // Todo: check or fix generating

    return {
      name: this.getField().name,
      hidden: this.getField().showInFilter && this.getField().hidden,
      alwaysOn: this.alwaysOn,
    }
  }
}

export default ListFormFilterFieldBuilder;
