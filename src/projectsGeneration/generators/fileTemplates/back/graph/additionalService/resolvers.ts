import { pascalCase } from 'change-case'
import {pascal} from '../../../../../../utils/cases'
import {AdditionalServiceWideGenerationArgs} from '../../../../../args'
import {generatedWarning} from '../../../../../utils'

export const backAdditionalServiceResolversTmpl = ({
  service,
  options,
}: AdditionalServiceWideGenerationArgs) => {
  const modelsToImport = service.methods.flatMap(q => [q.argsModel, q.returnModel]).flat().filter(m => m.fields.length);
  // return `import {ApolloClient, gql} from '@apollo/client';${serviceWithModelsToImport.length ? `\nimport {\n${serviceWithModelsToImport.flatMap(s => s.models.map(m => `  Mutation${pascalCase(s.service.name)}${pascalCase(m.name)},\n`)).join('')}} from '../generated/graphql';` : ''}


  return `import {
  Resolvers,
} from '../../../../generated/graphql';${modelsToImport.length ? `\nimport {\n${modelsToImport.map(m => `  ${pascalCase(m.name)},\n`).join('')}} from '../../../services/${pascalCase(service.name)}Service/types';` : ''}
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
