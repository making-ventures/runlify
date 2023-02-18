
// Types
// date
// datetime
// string
// int
// bigint
// float
// boolean

// Признаки для всех
// required

// string
// минимальная длинна
// максимальная длинна

// Только цыфры
// Только положительные цыфры

// Без цифр
// Без пробелов

// Только буквы
// Только латинские буквы
// Только кириллические буквы
// Только кириллические и латинские буквы

// Только буквы и цыфры
// Только латинские буквы и цыфры
// Только кириллические буквы и цыфры
// Только кириллические, латинские буквы и цыфры

// int, bigint, float
// Минимальное число
// максимальное число
// Только положительные
// Только отрициательные
// Не положительные
// Не отрицительные

export interface BaseValidation {
  required: boolean;
}

export interface StringValidation extends BaseValidation {
  type: 'string',
  length?: number; // string.length(limit: number | Ref, message?: string | function): Schema
  maxLength?: number;
  minLength?: number;

  onlyDigits?: boolean;
  onlyPositiveDigits?: boolean;

  noDigits?: boolean;
  noSpace?: boolean;

  onlyLetters?: boolean;
  onlyLatinLetters?: boolean;
  onlyCyrillicLetters?: boolean;
  onlyLatinAndCyrillicLetters?: boolean;

  onlyLettersAndDigits?: boolean;
  onlyLatinLettersAndDigits?: boolean;
  onlyCyrillicLettersAndDigits?: boolean;
  onlyLatinAndCyrillicLettersAndDigits?: boolean;

  password?: boolean;
  email?: boolean; // string.email(message?: string | function): Schema
  url?: boolean; // string.url(message?: string | function): Schema
}

export interface NumberValidation extends BaseValidation {
  max?: number;
  min?: number;

  positive?: boolean;
  negative?: boolean;

  notPositive?: boolean;
  notNegative?: boolean;
}

export interface IntValidation extends NumberValidation {
  type: 'int'
}
export interface FloatValidation extends NumberValidation {
  type: 'float'
}
export interface BigIntValidation extends NumberValidation {
  type: 'bigint'
}

// int
// required

// .number()
// .required(t('validation.required'))
// .integer(t('validation.onlyIntegers'))
// .max(2147483647, t('validation.maxValue', {max: 2147483647}))
// .typeError(t('validation.required')),