export const validationMessageFields = [
  'minLength',
  'maxLength',
  'minValue',
  'maxValue',
  'noSpaces',
  'noDigits',
  'password',
  'notFutureDate',
  'notPastDate',
  'required',
  'onlyLatinLetters',
  'onlyLatinLettersAndDigits',
  'onlyLatinLettersAndHyphen',
  'onlyLatinAndCyrillicLetters',
  'onlyLatinAndCyrillicLettersAndDigits',
  'onlyNumbers',
  'onlyLetters',
  'onlyIntegers',
  'exactLength',
  'datesInFilter',
  'emailFormat',
] as const

export const uiI18nTypesTmpl = () => `export type ValidationMessages = {
${validationMessageFields.map((field) => `  ${field}: string`).join('\n')}
}
`

export default uiI18nTypesTmpl
