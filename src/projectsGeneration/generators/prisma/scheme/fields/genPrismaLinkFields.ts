/* eslint-disable max-len */
/* eslint-disable no-tabs */
import { pascalSingular } from '../../../../../utils/cases'
import { Entity, LinkField } from '../../../../builders'
import { fieldIdTypeToPrismaType } from '../../fieldIdTypeToPrismaType'
import { genPrismaDefault } from './genPrismaDefault'
import { joinPrismaFieldParts } from './genPrismaScalarField'

export const genPrismaLinkFields = (
  entity: Entity,
  field: LinkField,
  forShards = false,
): string[] => {
  const trivialFieldName = field.name.endsWith('Id')
    ? field.name
    : `${field.name}Id`
  const linkFieldName = field.name.endsWith('Id')
    ? field.name.replaceAll(/Id$/gu, '')
    : field.name

  // const trivialField = `${trivialFieldName}	${fieldIdTypeToPrismaType(field.type)}${field.required ? '' : '?'}`
  //   .trim();
  const trivialField = joinPrismaFieldParts([
    trivialFieldName,
    `${fieldIdTypeToPrismaType(field.type)}${field.required ? '' : '?'}`,
    genPrismaDefault(field),
  ])
  const linkField = `${linkFieldName}	${pascalSingular(field.externalEntity)}${
    field.required ? '' : '?'
  }	@relation("From-${pascalSingular(
    entity.name
  )}.${linkFieldName}", fields: [${trivialFieldName}], references: [id])`.trim()

  const result = [`	${trivialField}`]

  if (field.linkCategory === 'entity' && !forShards) {
    result.push(`	${linkField}`)
  }

  return result.map((el) => el)
}
