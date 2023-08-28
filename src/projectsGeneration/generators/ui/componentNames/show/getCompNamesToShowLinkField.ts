// import { Entity, LinkField } from '../../../../builders/buildedTypes'
import { LinkShowComponentName, ShowComponentName } from '../types'
// import { getCompNameToShowScalar } from './getCompNameToShowScalar'
// import { getFieldByName } from '../../../../metaUtils'

export const getCompNamesToShowLinkField = (
  // field: LinkField,
  // allEntities: Map<string, Entity>
): Array<ShowComponentName | LinkShowComponentName> => {
  // const linkedEntity = allEntities.get(field.externalEntity)

  // if (!linkedEntity) {
  //   throw new Error(`There is no '${field.externalEntity}' entity`)
  // }

  return [
    // getCompNameToShowScalar(
    //   getFieldByName(linkedEntity, linkedEntity.titleField)
    // ),
    'ReferenceField',
  ]
}
