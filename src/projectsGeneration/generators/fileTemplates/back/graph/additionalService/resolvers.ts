import { pascalCase } from 'change-case'
import {pascal} from '../../../../../../utils/cases'
import {AdditionalServiceWideGenerationArgs} from '../../../../../args'
import {printWarningIfRequired} from '../../../../../utils'
import { MethodType } from '../../../../../builders'

export const backAdditionalServiceResolversTmpl = ({
  service,
  options,
}: AdditionalServiceWideGenerationArgs) => {
  const modelsToImport = service.methods.filter(method => method.exportedToApi).map(q => q.argsModel).filter(m => m.fields.length);

  const mutations = service.methods.filter((method) => method.exportedToApi && method.methodType === MethodType.Mutation);
  const queries = service.methods.filter((method) => method.exportedToApi && method.methodType === MethodType.Query);

  return `import {
  Resolvers,
} from '../../../../generated/graphql';${modelsToImport.length ? `\nimport {\n${modelsToImport.map(m => `  ${pascalCase(m.name)},\n`).join('')}} from '../../../services/${pascalCase(service.name)}Service/types';` : ''}
import {Context} from '../../../services/types';
${printWarningIfRequired(options)}
const resolvers: Resolvers = {
  Query: ${queries.length ? `{
${queries.map(m => `    ${service.name}${pascal(m.name)}:
      (_, ${m.argsModel.fields.length ? `args: ${pascalCase(m.name)}Args` : `__`}, {context}: {context: Context}) =>
        context.service('${service.name}').${m.name}(${m.argsModel.fields.length ? 'args' : ``}),`).join('\n')}
  },` : '{},'}
  Mutation: ${mutations.length ? `{
${mutations.map(m => `    ${service.name}${pascal(m.name)}:
      (_, ${m.argsModel.fields.length ? `args: ${pascalCase(m.name)}Args` : `__`}, {context}: {context: Context}) =>
        context.service('${service.name}').${m.name}(${m.argsModel.fields.length ? 'args' : ``}),`).join('\n')}
  },` : '{},'}
};

export default resolvers;
`
}
