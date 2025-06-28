import {GraphQLInputObjectType, GraphQLString} from 'graphql'
import {pascalSingular} from '../../../utils/cases'
import {Entity} from '../../builders/buildedTypes'
import {getKeyField} from '../../metaUtils'
import {genGraphFilter} from './filters/genGraphField'
import {genGraphIdPluralFilter} from './filters/genGraphIdFilter'

export const genGraphFilterType = (entity: Entity) => {
  return new GraphQLInputObjectType({
    name: `${pascalSingular(entity.name)}Filter`,
    fields: {
      ...(entity.searchEnabled ? {q: { type: GraphQLString }} : {}),
      ...genGraphIdPluralFilter(getKeyField(entity)),
      ...entity.fields
        .filter((f) => !f.hidden)
        .reduce((acc, cur) => ({ ...acc, ...genGraphFilter(cur) }), {}),
    },
  })
}
