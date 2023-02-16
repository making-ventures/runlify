/* eslint-disable max-len */
import { pascalSingular } from '../../../../../utils/cases'
import { EntityWideGenerationArgs } from '../../../../args'
import { Field } from '../../../../builders/buildedTypes'
import { generatedWarning } from '../../../../utils'

// import {fieldTypeToTsType} from '../../../fieldTypeToTsType';

const getFieldValidation = (field: Field): string | null => {
  if (field.required) {
    switch (field.type) {
      case 'string':
        return "Yup.string().required(t('validation.required')).typeError(t('validation.required'))"
      case 'date':
        return "Yup.string().required(t('validation.required')).typeError(t('validation.required'))"
      case 'datetime':
        return "Yup.date().required(t('validation.required')).typeError(t('validation.required'))"
      case 'int':
        return "Yup.number().required(t('validation.required')).integer(t('validation.onlyIntegers')).max(2147483647, t('validation.maxValue', {max: 2147483647})).typeError(t('validation.required'))"
      case 'float':
      case 'bigint':
        return "Yup.number().required(t('validation.required')).typeError(t('validation.required'))"
      default:
        return null
    }
  } else {
    switch (field.type) {
      case 'int':
        return "Yup.number().integer(t('validation.onlyIntegers')).max(2147483647, t('validation.maxValue', {max: 2147483647})).nullable()"
      default:
        return null
    }
  }
}

export const uiGetEntityValidationTmpl = ({
  options,
  entity,
}: EntityWideGenerationArgs) => {
  const validations = entity.fields
    .filter((f) => f.requiredOnInput)
    .map((field) => ({ field, validation: getFieldValidation(field) }))
    .filter(({ validation }) => validation)
  const hasValidations = validations.length > 0

  return `import * as Yup from 'yup';
import GetValidation from '../../../types/GetValidation';${
    hasValidations
      ? `
import {Translate} from 'react-admin';`
      : ''
  }
${
  options.skipWarningThisIsGenerated
    ? ''
    : `
// ${generatedWarning}
`
}
const get${pascalSingular(entity.name)}Validation: GetValidation = ${
    hasValidations ? '(t: Translate)' : '()'
  } => ${
    hasValidations
      ? `Yup.object({
${validations
  .map(({ field, validation }) => `  ${field.name}: ${validation},`)
  .join('\n')}
});`
      : 'Yup.object({});'
  }

export default get${pascalSingular(entity.name)}Validation;
`
}
