import {validationMessageFields} from './uiI18nTypesTmpl'

const defaultMessages: Record<typeof validationMessageFields[number], string> = {
  minLength: 'Minimum length is %{min} characters.',
  maxLength: 'Maximum length is %{max} characters.',
  minValue: 'Minimum value is %{min}.',
  maxValue: 'Maximum value is %{max}.',
  noSpaces: 'Spaces are not allowed.',
  noDigits: 'Digits are not allowed.',
  password: 'Password must contain lowercase and uppercase letters, digits and special characters.',
  notFutureDate: 'Future date is not allowed.',
  notPastDate: 'Past date is not allowed.',
  required: 'This field is required.',
  onlyLatinLetters: 'Only latin letters are allowed.',
  onlyLatinLettersAndDigits: 'Only latin letters and digits are allowed.',
  onlyLatinLettersAndHyphen: 'Only latin letters and hyphen are allowed.',
  onlyLatinAndCyrillicLetters: 'Only latin and cyrillic letters are allowed.',
  onlyLatinAndCyrillicLettersAndDigits: 'Only latin and cyrillic letters and digits are allowed.',
  onlyNumbers: 'Only digits are allowed.',
  onlyLetters: 'Only letters are allowed.',
  onlyIntegers: 'Only integers are allowed.',
  exactLength: 'Exact length is %{length} characters.',
  datesInFilter: 'Dates in the filter must be filled in.',
  emailFormat: 'Enter a valid email.',
}

export const uiI18nValidationTmpl = (lang: string) => `import {ValidationMessages} from '../types';

const ${lang}Validation: ValidationMessages = {
${validationMessageFields.map((field) => `  ${field}: '${defaultMessages[field]}',`).join('\n')}
};

export default ${lang}Validation;
`

export default uiI18nValidationTmpl
