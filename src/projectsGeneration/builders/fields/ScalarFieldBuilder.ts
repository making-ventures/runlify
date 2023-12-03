import {
  BaseFilter,
  DateFilter,
  IntFilter,
  ScalarField,
  StringFilter,
} from '../buildedTypes'
import BaseFieldBuilder from './BaseFieldBuilder'

class ScalarFieldBuilder extends BaseFieldBuilder {
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
        filters: this.filters as DateFilter[]
      }
    } else if (this.type === 'int' || this.type === 'bigint' || this.type === 'float') {
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
        filters: this.filters as IntFilter[],
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
        filters: this.filters as StringFilter[],
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
        filters: this.filters as BaseFilter[],
      }
    }
  }
}

export default ScalarFieldBuilder;
