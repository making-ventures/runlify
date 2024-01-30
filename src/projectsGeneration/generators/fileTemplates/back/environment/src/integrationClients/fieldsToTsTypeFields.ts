import {pascalCase} from 'change-case'
import {TsModelField} from '../../../../../../builders/buildedTypes'
import { fieldTypeToTsType } from '../../../../../fieldTypeToTsType'

const fieldsToTsTypeFields = (fields: TsModelField[]) =>
  fields.map(f => `${f.name}${f.required ? '' : '?'}: ${f.category === 'model' ? `${pascalCase(f.model)}${f.array ? '[]' : ''}` : fieldTypeToTsType(f.type)}`)

export default fieldsToTsTypeFields;
