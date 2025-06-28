import { IdField } from '../../../../builders'
import { fieldIdTypeToPrismaType } from '../../fieldIdTypeToPrismaType'
import { genPrismaDefault } from './genPrismaDefault'
import { joinPrismaFieldParts } from './genPrismaScalarField'

export const genPrismaIdField = (field: IdField, forShards = false): string[] => {
  const parts = [
    field.name,
    `${fieldIdTypeToPrismaType(field.type)}${field.required ? '' : '?'}`,
    forShards ? '' : genPrismaDefault(field),
    '@id',
  ].filter(p => p);

  const withoutPadding = joinPrismaFieldParts(parts)

  return [`  ${withoutPadding}`.replaceAll(/\s+/gu, '\t')]
}
