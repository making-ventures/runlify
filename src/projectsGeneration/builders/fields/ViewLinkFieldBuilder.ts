/* eslint-disable no-lonely-if */
import {
  ViewLinkField,
  TKeyFieldType,
  PredefinedLinkedEntity,
  FileType,
} from '../buildedTypes'
import { BaseFieldBuilder } from './BaseFieldBuilder'

export class ViewLinkFieldBuilder extends BaseFieldBuilder {
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
    this.entity = entity
    this.category = 'link'
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

  build(): ViewLinkField {
    const base = {
      name: this.name,
      required: this.required,
      requiredOnInput: this.requiredOnInput,
      updatable: this.updatable,
      needFor: this.needFor,
      updatableByUser: this.updatableByUser,
      defaultValueExpression: this.defaultValueExpression,
      defaultBackendValueExpression: this.defaultBackendValueExpression,
      hidden: this.hidden,
      searchable: this.searchable,
    }
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
          linkCategory: 'view',
          defaultDbValue: this.defaultDbValue,
          predefinedLinkedEntity: this.predefinedLinkedEntity,
          fileType: this.fileType,
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
          linkCategory: 'view',
          defaultDbValue: this.defaultDbValue,
          predefinedLinkedEntity: this.predefinedLinkedEntity,
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
          linkCategory: 'view',
          defaultDbValue: this.defaultDbValue,
          predefinedLinkedEntity: this.predefinedLinkedEntity,
          fileType: this.fileType,
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
          linkCategory: 'view',
          defaultDbValue: this.defaultDbValue,
          predefinedLinkedEntity: this.predefinedLinkedEntity,
        }
      }
    }
  }
}
