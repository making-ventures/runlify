/* eslint-disable max-len */
/* eslint-disable no-tabs */
import * as R from 'ramda'
import { pascalSingular } from '../../../../utils/cases'
import { Entity } from '../../../builders/buildedTypes'
import { getLinksFromExternalEntities } from '../../../links/getLinksFromExternalEntities'
import { LinkedEntities } from '../../../types'
import { genPrismaField } from './fields/genPrismaField'
import { genPrismaFieldFromExternalEntity } from './fields/genPrismaFieldFromExternalEntity'

export const genPrismaEntity = (
  entity: Entity,
  links: LinkedEntities[]
): string => {
  const fields = [
    ...R.flatten(entity.fields.map((field) => genPrismaField(entity, field))),
    ...getLinksFromExternalEntities(entity, links)
      .filter((el) => el.fromField.linkCategory === 'entity')
      .map((link) => genPrismaFieldFromExternalEntity(link)),
  ]

  return `model ${pascalSingular(entity.name)} {
${fields.join('\n')}${
    entity.uniqueConstraints.length > 0
      ? '\n' +
        entity.uniqueConstraints
          .map((fields) => `	@@unique([${fields.join(', ')}])`)
          .join('\n')
      : ''
  }
}
`
}
