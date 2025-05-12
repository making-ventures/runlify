import {TsModelField} from '../../../../../../builders/buildedTypes'
import {fieldToTsTypeFieldWithType} from './fieldToTsTypeFieldWithType';

export const fieldsToTsTypeFieldsWithTypes = (fields: TsModelField[]) =>
  fields.map(fieldToTsTypeFieldWithType)
