import {ConfigValue, ConfigVar, ConfigVarScope, FieldType} from './buildedTypes';

export class ConfigVarBuilder<T extends FieldType> {
  default: ConfigValue<T> | undefined
  constructor (
    public name: string,
    public type: T,
    public required = true,
    def: ConfigValue<T> | undefined,
    public needFor: string = '',
    public scopes: ConfigVarScope[] = ['back', 'worker', 'telegramBot'],
    public hidden = false,
    public editable = true,
  ) {
    this.default = def;
  }

  build (): ConfigVar<T> {
    return {
      name: this.name,
      type: this.type,
      needFor: this.needFor,
      default: this.default ?? '' as ConfigValue<T>,
      required: this.required,
      scopes: this.scopes,
      hidden: this.hidden,
      editable: this.editable,
    }
  }
  
  setRequired(value = true) {
    this.required = value

    return this
  }
  
  setNeedFor(value = '') {
    this.needFor = value

    return this
  }
  
  setScopes(scopes: ConfigVarScope[] = ['back', 'worker', 'telegramBot']) {
    this.scopes = scopes;

    return this;
  }

  addScopes(scope: ConfigVarScope) {
    this.scopes.push(scope);

    return this
  }

  delScopes(scope: ConfigVarScope) {
    this.scopes = this.scopes.filter((v) => v !== scope);

    return this
  }

  setHidden(value = false) {
    this.hidden = value

    return this
  }

  setEditable(value = true) {
    this.editable = value

    return this
  }

  setSecure() {
    this.hidden = true
    this.editable = false

    return this
  }

  setDefValue(
    def: ConfigValue<T> | undefined,
  ) {
    this.default = def ?? '' as ConfigValue<T>

    return this
  }
}