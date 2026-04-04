import * as R from 'ramda'
import {pascalSingular} from '../../../../utils/cases'
import {Entity, Field, IndexType, StringField} from '../../../builders'
import {getLinksFromExternalEntities} from '../../../links/getLinksFromExternalEntities'
import {LinkedEntities} from '../../../types'
import {genPrismaField} from './fields/genPrismaField'
import {genPrismaFieldFromExternalEntity} from './fields/genPrismaFieldFromExternalEntity'
import {pascalCase} from 'change-case'

const isJsonStringScalar = (field: Field): boolean =>
  field.category === 'scalar' &&
  field.type === 'string' &&
  (field as StringField).stringType === 'json'

const prismaIndexFieldFragment = (
  entity: Entity,
  fieldName: string,
  indexType: IndexType | undefined,
): string => {
  if (indexType !== IndexType.Gin) {
    return fieldName;
  }

  const field = entity.fields.find((f) => f.name === fieldName)

  if (!field || !isJsonStringScalar(field)) {
    return fieldName;
  }

  return `${fieldName}(ops: JsonbPathOps)`;
}

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
          `	@@index([${fields.map((name) => prismaIndexFieldFragment(entity, name, type)).join(', ')}]${type ? `, type: ${pascalCase(type)}` : ''})`
        )
        .join('\n')
    : ''
  }
}
`
}
