/* eslint-disable max-len */
import { pascalSingular } from '../../../../../utils/cases'
import { EntityWideGenerationArgs } from '../../../../args'
import { Field } from '../../../../builders/buildedTypes'
import { generatedWarning } from '../../../../utils'

// import {fieldTypeToTsType} from '../../../fieldTypeToTsType';

const getFieldValidation = (field: Field): string | null => {
  if (!field.required) {
    return null
  }

  // if (field.category === 'id') {
  //   return null
  // }

  // if (!field.requiredOnInput && field.requiredOnInput !== null) {
  //   return null;
  // }

  switch (field.type) {
    case 'string':
      return "Yup.string().required(t('validation.required')).typeError(t('validation.required'))"
    case 'date':
      return "Yup.string().required(t('validation.required')).typeError(t('validation.required'))"
    case 'datetime':
      return "Yup.date().required(t('validation.required')).typeError(t('validation.required'))"
    case 'float':
    case 'int':
    case 'bigint':
      return "Yup.number().required(t('validation.required')).typeError(t('validation.required'))"
    default:
      return null
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
