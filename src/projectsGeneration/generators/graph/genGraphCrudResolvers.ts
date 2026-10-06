import {pascalPlural, pascalSingular, camelPlural} from '../../../utils/cases'
import {Entity} from '../../builders/buildedTypes'
import {RuntimeGraphResolvers} from './runtimeGraphTypes'

// Mechanical in-memory transcription of backBaseResolversTmpl
// (generators/fileTemplates/back/graph/resolvers.ts) — kept in sync by
// graphSchemaModeParity.spec.ts.
export const genGraphCrudResolvers = (entity: Entity): RuntimeGraphResolvers => {
  const serviceName = camelPlural(entity.name)

  const resolvers: RuntimeGraphResolvers = {
    Query: {
      [pascalSingular(entity.name)]: (_, {id}, {context}) =>
        context.service(serviceName).get(id, true),
      [`all${pascalPlural(entity.name)}`]: (_, params, {context}) =>
        context.service(serviceName).all(params, true),
      [`_all${pascalPlural(entity.name)}Meta`]: (_, params, {context}) =>
        context.service(serviceName).meta(params, true),
    },
    Mutation: {
      [`create${pascalSingular(entity.name)}`]: (_, params, {context}) =>
        context.service(serviceName).create(params, true),
      [`update${pascalSingular(entity.name)}`]: (_, params, {context}) =>
        context.service(serviceName).update(params, true),
      [`remove${pascalSingular(entity.name)}`]: (_, params, {context}) =>
        context.service(serviceName).delete(params, true),
    },
  }

  if (entity.type === 'document') {
    resolvers.Mutation[`rePost${pascalSingular(entity.name)}`] = (
      _,
      params,
      {context}
    ) => context.service(serviceName).rePost?.(params.id, true)
  }

  return resolvers
}
