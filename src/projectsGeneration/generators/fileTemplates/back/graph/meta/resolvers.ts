export const graphMetaResolversTmpl = () => `import {
  Resolvers,
} from '../../../../generated/graphql';
import meta from '../../../../gen/metadata.json';

const queryResolvers: Resolvers = {
  Query: {
    Meta: () => meta,
  },
};

export default queryResolvers;
`
