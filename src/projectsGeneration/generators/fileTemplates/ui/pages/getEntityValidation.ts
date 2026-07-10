import {pascalSingular} from '../../../../../utils/cases'
import {EntityWideGenerationArgs} from '../../../../args'
import {Field} from '../../../../builders/buildedTypes'
import {isMoneyField, isStringNumberField} from '../../../../metaUtils'

const getFieldValidation = (field: Field): string | null => {
  if (field.requiredOnInput) {
    switch (field.type) {
      case 'string':
        if (isStringNumberField(field)) {
          return "Yup.string().onlyDigits().required()"
        }

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
        return "Yup.number().required()"
      case 'bigint':
        if (isMoneyField(field)) {
          return `Yup
    .number()
    .required()`
        }
        return "Yup.number().required()"
      default:
        return null
    }
  } else {
    switch (field.type) {
      case 'string':
        if (isStringNumberField(field)) {
          return "Yup.string().onlyDigits().nullable()";
        }

        return null;
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
      case 'bigint':
        if (isMoneyField(field)) {
          return `Yup
    .number()
    .nullable()`
        }
        return null
      default:
        return null
    }
  }
}

export const uiGetEntityValidationTmpl = ({
  entity,
}: EntityWideGenerationArgs) => {
  const validations = entity.fields
    .map((field) => ({ field, validation: getFieldValidation(field) }))
    .filter(({ validation }) => validation)
  const hasValidations = validations.length > 0

  return `import * as Yup from 'yup';

const get${pascalSingular(entity.name)}Validation = () => ${
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
