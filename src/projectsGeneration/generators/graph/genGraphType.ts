import {GraphQLObjectType} from 'graphql'
import {pascalSingular} from '../../../utils/cases'
import {Entity} from '../../builders/buildedTypes'
import {genGraphField} from './fields/genGraphField'

export const genGraphType = (entity: Entity) => {
  return new GraphQLObjectType({
    name: pascalSingular(entity.name),
    fields: entity.fields
      .filter((f) => !f.hidden)
      .reduce((acc, cur) => ({ ...acc, ...genGraphField(cur, 'input') }), {}),
  })
}
