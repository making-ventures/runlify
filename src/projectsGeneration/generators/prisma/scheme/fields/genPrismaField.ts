import {
  Entity,
  IdField,
  LinkField,
  ScalarField,
} from '../../../../builders'
import { genPrismaIdField } from './genPrismaIdField'
import { genPrismaLinkFields } from './genPrismaLinkFields'
import { genPrismaScalarField } from './genPrismaScalarField'

export const genPrismaField = (
  entity: Entity,
  field: LinkField | ScalarField | IdField,
  forShards = false,
): string[] => {
  const { category } = field
  switch (category) {
    case 'scalar':
      return genPrismaScalarField(field)
    case 'id':
      return genPrismaIdField(field, forShards)
    case 'link':
      return genPrismaLinkFields(entity, field, forShards)
    default:
      throw new Error(`Unexpected "${category}" category`)
  }
}
