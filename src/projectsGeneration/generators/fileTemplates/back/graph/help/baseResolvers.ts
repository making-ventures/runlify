const baseResolversTmpl = () => `import {
  Resolvers,
  QueryGetHelpArgs,
} from '../../../../generated/graphql';

import {Context} from '../../../services/types';

const queryResolvers: Resolvers = {
  Query: {
    getHelp: (_, params: QueryGetHelpArgs, {context}: {context: Context}) =>
      context.service('help').getHelp(params.entityType),
  },
};

export default queryResolvers;
`

export default baseResolversTmpl
