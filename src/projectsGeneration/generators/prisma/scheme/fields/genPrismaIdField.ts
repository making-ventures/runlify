/* eslint-disable max-len */
import { IdField } from '../../../../builders'
import { fieldIdTypeToPrismaType } from '../../fieldIdTypeToPrismaType'
import { genPrismaDefault } from './genPrismaDefault'
import { joinPrismaFieldParts } from './genPrismaScalarField'

export const genPrismaIdField = (field: IdField, forShards = false): string[] => {
  // const withoutPadding = `${field.name}  ${fieldIdTypeToPrismaType(field.type)}${field.required ? '' : '?'} ${genPrismaDefault(field)} @id`
  //   .trim();

  const parts = [
    field.name,
    `${fieldIdTypeToPrismaType(field.type)}${field.required ? '' : '?'}`,
    forShards ? '' : genPrismaDefault(field),
    '@id',
  ].filter(p => p);

  const withoutPadding = joinPrismaFieldParts(parts)

  return [`  ${withoutPadding}`.replace(/\s+/gu, '\t')]
}
