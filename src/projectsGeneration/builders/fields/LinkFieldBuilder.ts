import {
  FileType,
  IntFilter,
  LinkField,
  PredefinedLinkedEntity,
  StringFilter,
  TKeyFieldType,
} from '../buildedTypes'
import BaseFieldBuilder from './BaseFieldBuilder'

class LinkFieldBuilder extends BaseFieldBuilder {
  type: TKeyFieldType = 'int'
  predefinedLinkedEntity: PredefinedLinkedEntity = 'none'
  fileType: FileType = 'plain'
  updatable = true

  constructor(
    entity: string,
    name: string,
    defaultLanguage: string,
    title?: string
  ) {
    super(name, defaultLanguage, title)
    this.checkName(name)
    this.entity = entity
    this.category = 'link'
    // this.setTitle(title);
  }

  checkName(name: string) {
    if (!name.endsWith('Id')) {
      throw new Error(`Link field name should end by 'Id'. Current name: "${name}"`);
    }
  }

  setName(name: string) {
    this.checkName(name)

    return super.setName(name)
  }

  setType(type: TKeyFieldType) {
    this.type = type

    return this
  }

  setPredefinedLinkedEntity(predefinedLinkedEntity: PredefinedLinkedEntity) {
    this.predefinedLinkedEntity = predefinedLinkedEntity

    return this
  }

  setFileType(fileType: FileType) {
    if (this.predefinedLinkedEntity !== 'file') {
      throw new Error(
        `fileType May be set only for file predefinedLinkedEntity. Current predefinedLinkedEntity: ${this.predefinedLinkedEntity}`
      )
    }

    this.fileType = fileType

    return this
  }

  build(): LinkField {
    const base = super.build()

    if (this.type === 'bigint' || this.type === 'int') {
      if (this.predefinedLinkedEntity === 'file') {
        return {
          ...base,
          type: this.type,
          externalEntity: this.entity,
          category: 'link',
          title: this.title,
          showInList: this.showInList,
          showInCreate: this.showInCreate,
          showInEdit: this.showInEdit,
          showInFilter: this.showInFilter,
          linkCategory: 'entity',
          defaultDbValue: this.defaultDbValue,
          predefinedLinkedEntity: this.predefinedLinkedEntity,
          fileType: this.fileType,
          filters: this.filters as StringFilter[],
        }
      } else {
        return {
          ...base,
          type: this.type,
          externalEntity: this.entity,
          category: 'link',
          title: this.title,
          showInList: this.showInList,
          showInCreate: this.showInCreate,
          showInEdit: this.showInEdit,
          showInFilter: this.showInFilter,
          linkCategory: 'entity',
          defaultDbValue: this.defaultDbValue,
          predefinedLinkedEntity: this.predefinedLinkedEntity,
          filters: this.filters as IntFilter[],
        }
      }
    } else {
      if (this.predefinedLinkedEntity === 'file') {
        return {
          ...base,
          type: this.type,
          externalEntity: this.entity,
          category: 'link',
          title: this.title,
          showInList: this.showInList,
          showInCreate: this.showInCreate,
          showInEdit: this.showInEdit,
          showInFilter: this.showInFilter,
          linkCategory: 'entity',
          defaultDbValue: this.defaultDbValue,
          predefinedLinkedEntity: this.predefinedLinkedEntity,
          fileType: this.fileType,
          filters: this.filters as StringFilter[],
        }
      } else {
        return {
          ...base,
          type: this.type,
          externalEntity: this.entity,
          category: 'link',
          title: this.title,
          showInList: this.showInList,
          showInCreate: this.showInCreate,
          showInEdit: this.showInEdit,
          showInFilter: this.showInFilter,
          linkCategory: 'entity',
          defaultDbValue: this.defaultDbValue,
          predefinedLinkedEntity: this.predefinedLinkedEntity,
          filters: this.filters as StringFilter[],
        }
      }
    }
  }
}

export default LinkFieldBuilder;
