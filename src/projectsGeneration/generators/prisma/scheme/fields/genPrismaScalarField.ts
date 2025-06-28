import {ScalarField} from '../../../../builders/buildedTypes'
import {fieldTypeToPrismaType} from '../../fieldTypeToPrismaType'
import {genPrismaDefault} from './genPrismaDefault'

export const joinPrismaFieldParts = (parts: Array<string | undefined>) =>
  parts
    .filter((p) => p)
    .map((p) => (p as string).trim())
    .filter((p) => p)
    .join('\t')

export const genPrismaScalarField = (field: ScalarField): string[] => {
  const withoutPadding = joinPrismaFieldParts([
    field.name,
    `${fieldTypeToPrismaType(field)}${field.required ? '' : '?'}`,
    field.type === 'date' ? '	@db.Date' : '',
    genPrismaDefault(field),
  ])

  return [`  ${withoutPadding}`.replaceAll(/\s+/gu, '\t')]
}
