import * as R from 'ramda'
import { sentence } from '../../../utils/cases'
import {
  Meaning,
  FieldType,
  DefaultDbValue,
  StringType,
  BaseField,
  Filter,
} from '../buildedTypes'

abstract class BaseFieldBuilder {
  defaultLanguage: string
  category: 'trivial' | 'link' = 'trivial'
  type: FieldType = 'int'
  meaning?: Meaning
  name: string
  stringType: StringType = StringType.Plain
  entity = ''
  title: Record<string, string> = {}
  translationKey = ''
  defaultValueExpression?: string
  defaultBackendValueExpression?: string
  needFor = ''
  required = false
  defaultDbValue: DefaultDbValue
  hidden = false
  searchable = true
  // constantOnCreate: ConstantOnCreate = false
  // constantOnUpdate: ConstantOnUpdate = false
  requiredOnInput: boolean | null = null
  updatable = true
  updatableByUser = true
  showInList = true
  showInFilter = true
  showInCreate = true
  showInEdit = true
  showInShow = true
  sharded = false
  filters: Filter[] = ['equal']

  constructor(name: string, defaultLanguage: string, title?: string) {
    this.defaultLanguage = defaultLanguage
    this.name = name
    this.setName(name)
    this.setTitle(
      title || sentence(name.endsWith('Id') ? name.replaceAll('Id', '') : name)
    )
  }

  build (): BaseField {
    return {
      name: this.name,
      title: this.title,
      needFor: this.needFor,
      updatable: this.updatable,
      required: this.required,
      requiredOnInput: this.requiredOnInput,
      updatableByUser: this.updatableByUser,
      hidden: this.hidden,
      searchable: this.searchable,
      showInList: this.showInList,
      showInCreate: this.showInCreate,
      showInEdit: this.showInEdit,
      showInFilter: this.showInFilter,
      showInShow: this.showInShow,
      defaultDbValue: this.defaultDbValue,
      defaultValueExpression: this.defaultValueExpression,
      defaultBackendValueExpression: this.defaultBackendValueExpression,
      sharded: this.sharded,
      filters: this.filters,
    }
  }

  setName(name: string) {
    if (!/^[a-zA-Z0-9]+$/.test(name)) {
      throw new Error(`Name can contain only letters and numbers. Current name: "${name}"`);
    }

    this.name = name

    return this
  }
  setNeedFor(needFor: string) {
    this.needFor = needFor

    return this
  }
  setTitle(title: string, language?: string) {
    const resultedLangiage = language ? language : this.defaultLanguage
    this.title[resultedLangiage] = title

    return this
  }
  setTitles(title: Record<string, string>) {
    this.title = R.fromPairs(
      R.toPairs(title).map(([key, value]) => [
        key,
        value.replaceAll("'", "\\'"),
      ])
    )

    return this
  }
  setType(type: FieldType) {
    if (this.filtersAllowedForType(this.filters, type)) {
      this.type = type 
    }

    if (['bool'].includes(type)) {
      this.setSearchable(false)
      // this.setDefaultValueExpression('false')
    }

    return this
  }

  setStringType(stringType: StringType) {
    if (this.type !== 'string') {
      throw new Error(
        `stringType May be set only for string field. Current type: ${this.type}`
      )
    }

    this.stringType = stringType

    if ([StringType.Markdown, StringType.Json].includes(stringType)) {
      this.showInList = false
      this.showInFilter = false
      this.showInList = false
    }

    return this
  }

  setMeaning(meaning: Meaning) {
    this.meaning = meaning

    return this
  }
  setRequiredOnInput(value: boolean, defaultValueExpression?: string) {
    this.requiredOnInput = value
    if (defaultValueExpression) {
      this.setDefaultValueExpression(defaultValueExpression)
    }

    return this
  }

  setShowInList(value = true) {
    this.showInList = value

    return this
  }

  setShowInFilter(value = true) {
    this.showInFilter = value

    return this
  }

  setShowInCreate(value = true) {
    this.showInCreate = value

    return this
  }

  setShowInEdit(value = true) {
    this.showInEdit = value

    return this
  }

  setShowInShow(value = true) {
    this.showInShow = value

    return this
  }

  setHidden(value = true) {
    this.hidden = value

    return this
  }
  setSearchable(value = true) {
    this.searchable = value

    return this
  }
  setUpdatable(value = true) {
    this.updatable = value

    return this
  }
  setUpdatableByUser() {
    this.updatableByUser = true

    return this
  }
  setNotUpdatableByUser(
    defaultValueExpression?: string,
    defaultBackendValueExpression?: string
  ) {
    this.updatableByUser = false
    this.setRequiredOnInput(false, defaultValueExpression)
    if (defaultValueExpression) {
      this.setDefaultValueExpression(defaultValueExpression)
    }

    if (defaultBackendValueExpression) {
      this.setDefaultBackendValueExpression(defaultBackendValueExpression)
    }

    return this
  }
  setDefaultValueExpression(value: string) {
    if (['null', 'undefined'].includes(value)) {
      throw new Error(
        `"${value}" can not be default value. "${this.name}" field`
      )
    }

    this.defaultValueExpression = value

    this.setDefaultBackendValueExpression(value)

    return this
  }
  setDefaultBackendValueExpression(value: string) {
    if (['null', 'undefined'].includes(value)) {
      throw new Error(
        `"${value}" can not be default value. "${this.name}" field`
      )
    }

    this.defaultBackendValueExpression = value

    return this
  }
  setDefaultDbValue(defaultDbValue: DefaultDbValue) {
    this.defaultDbValue = defaultDbValue

    return this
  }
  // setConstantOnCreate(value: ConstantOnCreate) {
  //   if (this.type !== 'datetime' && this.type !== 'int') {
  //     throw new Error('Operation not permitted')
  //   }

  //   if (this.type === 'datetime' && value !== false && value !== 'now') {
  //     throw new Error('Constant not permitted')
  //   }

  //   if (this.type === 'int' && value !== false && value !== 'currentUser') {
  //     throw new Error('Constant not permitted')
  //   }

  //   if (this.constantOnUpdate) {
  //     throw new Error(
  //       'constantOnCreate and constantOnUpdate can not be set at the same time'
  //     )
  //   }

  //   this.constantOnCreate = value
  //   this.setRequiredOnInput(false)
  //   this.setUpdatable(false)

  //   return this
  // }
  // setConstantOnUpdate(value: ConstantOnUpdate) {
  //   if (this.type !== 'datetime' && this.type !== 'int') {
  //     throw new Error('Operation not permitted')
  //   }

  //   if (this.type === 'datetime' && value !== false && value !== 'now') {
  //     throw new Error('Constant not permitted')
  //   }

  //   if (this.type === 'int' && value !== false && value !== 'currentUser') {
  //     throw new Error('Constant not permitted')
  //   }

  //   if (this.constantOnCreate) {
  //     throw new Error(
  //       'constantOnCreate and constantOnUpdate can not be set at the same time'
  //     )
  //   }

  //   this.constantOnUpdate = value
  //   this.setRequiredOnInput(false)

  //   return this
  // }
  setRequired(value = true) {
    this.required = value

    if (this.requiredOnInput === null) {
      this.requiredOnInput = value
    }

    return this
  }
  setNotRequired() {
    this.required = false

    return this
  }
  setSharded (value = true) {
    this.sharded = value

    return this
  }
  setFilters (filters: Filter[]) {
    if (this.filtersAllowedForType(filters, this.type)) {
      this.filters = filters;
    }
    
    return this;
  }
  addFilters (filters: Filter[]) {
    if (this.filtersAllowedForType(filters, this.type)) {
      this.filters.push(...filters);
    }

    return this;
  }
  addFilter (filter: Filter) {
    if (this.filtersAllowedForType([filter], this.type)) {
      this.filters.push(filter);
    }

    return this;
  } 
  delFilter (filter: Filter) {
    this.filters = this.filters.filter((item: Filter) => item !== filter);

    return this;
  }
  filtersAllowedForType(filters: Filter[], type: FieldType) {
    const allowedFiltersForType = {
      int: ['equal', 'defined', 'not_defined', 'in', 'not_in', 'lte', 'gte', 'lt', 'gt'],
      float: ['equal', 'defined', 'not_defined', 'in', 'not_in', 'lte', 'gte', 'lt', 'gt'],
      date: ['equal', 'defined', 'not_defined', 'lte', 'gte', 'lt', 'gt'],
      datetime: ['equal', 'defined', 'not_defined', 'lte', 'gte', 'lt', 'gt'],
      string: ['equal', 'defined', 'not_defined', 'in', 'not_in'],
      bool: ['equal', 'defined', 'not_defined'],
    }
    
    filters.some((f) => {
      if(!allowedFiltersForType[type].includes(f)) {
        throw new Error(`Filter '${f}' is not allowed to field type ${type}`);
      }
    });

    filters.some((f) => {
      if (['in', 'not_in'].includes(f) && this.category !== 'link') {
        throw new Error(`Filters 'in' and 'not_in' allowed only for linked fields`);
      }
    });

    return true;
  }
}

export default BaseFieldBuilder;
