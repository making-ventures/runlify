import BaseSavableEntityBuilder from '../BaseSavableEntityBuilder'
import {LinkedEntity, ShowForm} from './Forms'

class ShowFormBuilder {
  getEntity: () => BaseSavableEntityBuilder
  private ignoredLinkedEntities: LinkedEntity[] = [];

  constructor(getEntity: () => BaseSavableEntityBuilder) {
    this.getEntity = getEntity
  }

  addIgnoredLinkedEntity(entity: string, field?: string) {
    this.ignoredLinkedEntities.push({entity, field});

    return this;
  }

  build(): ShowForm {
    return {
      ignoredLinkedEntities: this.ignoredLinkedEntities,
    }
  }
}

export default ShowFormBuilder;
