export const graphMetaResolversTmpl = () => `import {
  QueryGetEntityIdsLinkedFromEntityArgs,
  QueryGetEntityIdsLinkedToEntityArgs,
  Resolvers,
} from '../../../../generated/graphql';
import {Context} from '../../../services/types';

const queryResolvers: Resolvers = {
  Query: {
    EntityMeta: (_, {id}, {context}: {context: Context}) =>
      context.service('meta').getEntityById(id),
    getEntityIds:
      (_, __, {context}: {context: Context}) =>
        context.service('meta').getEntityIds(),
    getEntityIdsLinkedToEntity:
      (_, {id}: QueryGetEntityIdsLinkedToEntityArgs, {context}: {context: Context}) =>
        context.service('meta').getEntityIdsLinkedToEntity(id),
    getEntityIdsLinkedFromEntity:
      (_, {id}: QueryGetEntityIdsLinkedFromEntityArgs, {context}: {context: Context}) =>
        context.service('meta').getEntityIdsLinkedFromEntity(id),
  },
};

export default queryResolvers;
`
