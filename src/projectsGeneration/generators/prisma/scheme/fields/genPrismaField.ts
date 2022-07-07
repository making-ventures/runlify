import {
  Entity,
  IdField,
  LinkField,
  ScalarField,
} from '../../../../builders/buildedTypes'
import { genPrismaIdField } from './genPrismaIdField'
import { genPrismaLinkFields } from './genPrismaLinkFields'
import { genPrismaScalarField } from './genPrismaScalarField'

export const genPrismaField = (
  entity: Entity,
  field: LinkField | ScalarField | IdField
): string[] => {
  const { category } = field
  switch (category) {
    case 'scalar':
      return genPrismaScalarField(field)
    case 'id':
      return genPrismaIdField(field)
    case 'link':
      return genPrismaLinkFields(entity, field)
    default:
      throw new Error(`Unexpected "${category}" category`)
  }
}
