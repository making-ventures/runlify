import BaseSavableEntityBuilder from '../BaseSavableEntityBuilder'
import {
  DocumentationOfDocument,
  WayOfCreation,
} from './DocumentationOfDocument'

export class DocumentationOfDocumentBuilder {
  getEntity: () => BaseSavableEntityBuilder
  waysOfCreation: WayOfCreation[] = []

  constructor(getEntity: () => BaseSavableEntityBuilder) {
    this.getEntity = getEntity
  }

  getWaysOfCreation(): WayOfCreation[] {
    return this.waysOfCreation
  }

  build(): DocumentationOfDocument {
    return {
      waysOfCreation: this.waysOfCreation,
    }
  }
}
