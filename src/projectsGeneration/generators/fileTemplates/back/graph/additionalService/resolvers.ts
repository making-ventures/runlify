import {pascal} from '../../../../../../utils/cases'
import {AdditionalServiceWideGenerationArgs} from '../../../../../args'
import {generatedWarning} from '../../../../../utils'

export const backAdditionalServiceResolversTmpl = ({
  service,
  options,
}: AdditionalServiceWideGenerationArgs) => `import {
  Resolvers,
} from '../../../../generated/graphql';
import {Context} from '../../../services/types';
${
  options.skipWarningThisIsGenerated
    ? ''
    : `
// ${generatedWarning}
`
}
const queryResolvers: Resolvers = {
  Query: {},
  Mutation: ${service.methods.filter(m => m.exportedToApi).length ? `{
${service.methods.filter(m => m.exportedToApi).map(method => `    ${service.name}${pascal(method.name)}:
      (_, __, {context}: {context: Context}) =>
        context.service('${service.name}').${method.name}(),`).join('\n')}
  },` : '{},'}
};

export default queryResolvers;
`
