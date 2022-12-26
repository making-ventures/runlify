import * as R from 'ramda'
import { sentence } from '../../../utils/cases'
import {
  Meaning,
  FieldType,
  DefaultDbValue,
  StringType,
} from '../buildedTypes'

export abstract class BaseFieldBuilder {
  defaultLanguage: string
  category: 'trivial' | 'link' = 'trivial'
  type: FieldType = 'int'
  meaning?: Meaning
  name = 'notSet'
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
  showInWidget = true
  showInCreate = true
  showInEdit = true
  constructor(name: string, defaultLanguage: string, title?: string) {
    this.defaultLanguage = defaultLanguage
    this.setName(name)
    this.setTitle(
      title || sentence(name.endsWith('Id') ? name.replace('Id', '') : name)
    )
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
    this.type = type

    if (['bool'].includes(type)) {
      this.setSearchable(false)
      this.setDefaultValueExpression('false')
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
      this.showInWidget = false
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
}
