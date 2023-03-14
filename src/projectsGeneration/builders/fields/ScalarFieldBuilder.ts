import {
  ScalarField,
} from '../buildedTypes'
import { BaseFieldBuilder } from './BaseFieldBuilder'

export class ScalarFieldBuilder extends BaseFieldBuilder {
  build(): ScalarField {
    const base = super.build()

    if (this.type === 'datetime' || this.type === 'date') {
      return {
        ...base,
        type: this.type,
        // constantOnCreate: this.constantOnCreate as ConstantOnCreateDate,
        // constantOnUpdate: this.constantOnUpdate as ConstantOnUpdateDate,
        category: 'scalar',
        title: this.title,
        showInList: this.showInList,
        showInCreate: this.showInCreate,
        showInEdit: this.showInEdit,
        showInFilter: this.showInFilter,
        defaultDbValue: this.defaultDbValue,
      }
    } else if (this.type === 'int' || this.type === 'bigint') {
      return {
        ...base,
        type: this.type,
        // constantOnCreate: this.constantOnCreate as ConstantOnCreateInt,
        // constantOnUpdate: this.constantOnUpdate as ConstantOnUpdateInt,
        category: 'scalar',
        title: this.title,
        showInList: this.showInList,
        showInCreate: this.showInCreate,
        showInEdit: this.showInEdit,
        showInFilter: this.showInFilter,
        defaultDbValue: this.defaultDbValue,
      }
    } else if (this.type === 'string') {
      return {
        ...base,
        type: this.type,
        category: 'scalar',
        title: this.title,
        showInList: this.showInList,
        showInCreate: this.showInCreate,
        showInEdit: this.showInEdit,
        showInFilter: this.showInFilter,
        defaultDbValue: this.defaultDbValue,
        stringType: this.stringType,
      }
    } else {
      return {
        ...base,
        type: this.type,
        category: 'scalar',
        title: this.title,
        showInList: this.showInList,
        showInCreate: this.showInCreate,
        showInEdit: this.showInEdit,
        showInFilter: this.showInFilter,
        defaultDbValue: this.defaultDbValue,
      }
    }
  }
}
