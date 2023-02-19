/* eslint-disable max-len */
import { pascalSingular } from '../../../../../utils/cases'
import { EntityWideGenerationArgs } from '../../../../args'
import { Field } from '../../../../builders/buildedTypes'
import { generatedWarning } from '../../../../utils'

// import {fieldTypeToTsType} from '../../../fieldTypeToTsType';

const getFieldValidation = (field: Field): string | null => {
  if (field.requiredOnInput) {
    switch (field.type) {
      case 'string':
        return "Yup.string().required()"
      case 'date':
        return "Yup.string().required()"
      case 'datetime':
        return "Yup.date().required()"
      case 'int':
        if (field.category === 'scalar') {
          return `Yup
    .number()
    .required()
    .integer()
    .max(2147483647)`
        } else {
          return `Yup
    .number()
    .required()`
        }
      case 'float':
      case 'bigint':
        return "Yup.number().required()"
      default:
        return null
    }
  } else {
    switch (field.type) {
      case 'int':
        if (field.category === 'scalar') {
          return `Yup
    .number()
    .integer()
    .max(2147483647)
    .nullable()`
        } else {
          return null
        }
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
    // .filter((f) => f.requiredOnInput)
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
