/* eslint-disable max-len */
import { IdField } from '../../../../builders/buildedTypes'
import { fieldIdTypeToPrismaType } from '../../fieldIdTypeToPrismaType'
import { genPrismaDefault } from './genPrismaDefault'
import { joinPrismaFieldParts } from './genPrismaScalarField'

export const genPrismaIdField = (field: IdField): string[] => {
  // const withoutPadding = `${field.name}  ${fieldIdTypeToPrismaType(field.type)}${field.required ? '' : '?'} ${genPrismaDefault(field)} @id`
  //   .trim();

  const withoutPadding = joinPrismaFieldParts([
    field.name,
    `${fieldIdTypeToPrismaType(field.type)}${field.required ? '' : '?'}`,
    genPrismaDefault(field),
    '@id',
  ])

  return [`  ${withoutPadding}`.replace(/\s+/gu, '\t')]
}
