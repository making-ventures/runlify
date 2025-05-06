import {
  camelSingular,
  pascalPlural,
  pascalSingular,
} from '../../../../../utils/cases'
import { LinkedEntities } from '../../../../types'

export const genPrismaFieldFromExternalEntity = (
  link: LinkedEntities
): string => {
  const fromFieldName = link.fromField.name.replaceAll(/Id$/gu, '')
  const withoutPadding = `${camelSingular(link.entityOwnerName)}${pascalPlural(
    fromFieldName
  )}  ${pascalSingular(
    link.entityOwnerName
  )}[] @relation("From-${pascalSingular(
    link.entityOwnerName
  )}.${fromFieldName}")`.trim()

  return `  ${withoutPadding}`.replaceAll(/\s+/gu, '\t')
}
