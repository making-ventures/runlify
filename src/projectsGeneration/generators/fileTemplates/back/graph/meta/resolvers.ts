export const graphMetaResolversTmpl = () => `import {
  Resolvers,
} from '../../../../generated/graphql';
import meta from '../../../../meta/metadata.json';

const queryResolvers: Resolvers = {
  Query: {
    Meta: () => meta,
  },
};

export default queryResolvers;
`
