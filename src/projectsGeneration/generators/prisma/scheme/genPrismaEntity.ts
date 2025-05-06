import * as R from 'ramda'
import { pascalSingular } from '../../../../utils/cases'
import { Entity } from '../../../builders'
import { getLinksFromExternalEntities } from '../../../links/getLinksFromExternalEntities'
import { LinkedEntities } from '../../../types'
import { genPrismaField } from './fields/genPrismaField'
import { genPrismaFieldFromExternalEntity } from './fields/genPrismaFieldFromExternalEntity'
import { pascalCase } from 'change-case'

export const genPrismaEntity = (
  entity: Entity,
  links: LinkedEntities[],
  forShards = false,
): string => {
  const fields = [
    ...R.flatten(entity.fields.map((field) => genPrismaField(entity, field, forShards))),
    ...forShards ? [] : getLinksFromExternalEntities(entity, links)
      .filter((el) => el.fromField.linkCategory === 'entity')
      .map((link) => genPrismaFieldFromExternalEntity(link))
      .filter((l) => l),
  ]

  return `model ${pascalSingular(entity.name)} {
${fields.join('\n')}${
    entity.uniqueConstraints.length > 0
      ? '\n' +
        entity.uniqueConstraints
          .map((fields) => `	@@unique([${fields.join(', ')}])`)
          .join('\n')
      : ''
  }${
    entity.indexes.length > 0
    ? '\n' +
      entity.indexes
        .map(({fields, type}) => 
          `	@@index([${fields.join(', ')}]${type ? `, type: ${pascalCase(type)}` : ''})`
        )
        .join('\n')
    : ''
  }
}
`
}
