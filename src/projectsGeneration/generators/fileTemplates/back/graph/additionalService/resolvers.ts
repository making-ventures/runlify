import { pascalCase } from 'change-case'
import {pascal} from '../../../../../../utils/cases'
import {AdditionalServiceWideGenerationArgs} from '../../../../../args'
import {generatedWarning} from '../../../../../utils'

export const backAdditionalServiceResolversTmpl = ({
  service,
  options,
}: AdditionalServiceWideGenerationArgs) => {
  const modelsToImport = service.methods.flatMap(q => [q.argsModel, q.returnModel]).flat().filter(m => m.fields.length);
  return `import {
  Resolvers,
} from '../../../../generated/graphql';${modelsToImport.length ? modelsToImport.map(m => `\nimport {${pascalCase(m.name)}} from '../../../services/${pascalCase(service.name)}Service/types';`).join('') : ''}
import {Context} from '../../../services/types';
${
  options.skipWarningThisIsGenerated
    ? ''
    : `
// ${generatedWarning}
`
}
const resolvers: Resolvers = {
  Query: {},
  Mutation: ${service.methods.filter(m => m.exportedToApi).length ? `{
${service.methods.filter(m => m.exportedToApi).map(m => `    ${service.name}${pascal(m.name)}:
      (_, ${m.argsModel.fields.length ? `args: ${pascalCase(m.name)}Args` : `__`}, {context}: {context: Context}) =>
        context.service('${service.name}').${m.name}(${m.argsModel.fields.length ? 'args' : ``}),`).join('\n')}
  },` : '{},'}
};

export default resolvers;
`
}
