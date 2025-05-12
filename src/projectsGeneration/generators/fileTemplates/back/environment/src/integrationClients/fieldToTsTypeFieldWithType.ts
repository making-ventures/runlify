import {pascalCase} from 'change-case'
import {ScalarField, TsModelField} from '../../../../../../builders/buildedTypes'
import {fieldTypeToTsType} from '../../../../../fieldTypeToTsType'

export const fieldToTsTypeFieldWithType = (field: TsModelField) =>
  `${field.name}${field.required ? '' : '?'}: ${field.category === 'model' ? `${pascalCase(field.model)}` : fieldTypeToTsType((field as ScalarField).type)}${field.array ? '[]' : ''}`;

