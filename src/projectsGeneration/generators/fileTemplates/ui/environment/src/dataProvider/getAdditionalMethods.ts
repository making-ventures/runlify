import {
  BootstrapEntityOptions,
  defaultBootstrapEntityOptions,
} from '../../../../../../types'
import { AdditionalService, MethodType, ScalarField } from '../../../../../../builders/buildedTypes'
import { generatedWarning } from '../../../../../../utils'
import { pascalCase } from 'change-case'
import fieldTypeToGraphScalarStringified from '../../../../../graph/fieldTypeToGraphScalarStringified'

export const uiGetAdditionalMethodsTmpl = (
  additionalServices: AdditionalService[],
  options: BootstrapEntityOptions = defaultBootstrapEntityOptions
) => {

  if (!additionalServices.length) {
    return `import {ApolloClient} from '@apollo/client';
${
  options.skipWarningThisIsGenerated
    ? ''
    : `
// ${generatedWarning}
`
}
const getAdditionalMethods = (
  _client: ApolloClient<unknown>,
) => ({});

export default getAdditionalMethods;
`;
  }

  const serviceWithModelsToImport = additionalServices
    .flatMap(
      service => service.methods.flatMap(q => ({service, models: [q.argsModel].filter(m => m.fields.length)}))
    )
    .filter(m => m.models.length);

  return `import {ApolloClient, gql} from '@apollo/client';${serviceWithModelsToImport.length ? `\nimport {\n${serviceWithModelsToImport.flatMap(s => s.models.map(m => `  Mutation${pascalCase(s.service.name)}${pascalCase(m.name)},\n`)).join('')}} from '../generated/graphql';` : ''}
${
  options.skipWarningThisIsGenerated
    ? ''
    : `
// ${generatedWarning}
`
}
const getAdditionalMethods = (
  client: ApolloClient<unknown>,
) => ({
${additionalServices.flatMap(service => service.methods.map(method => {
  const methodName = `${service.name}${pascalCase(method.name)}`;

  return`  ${methodName}: async (${method.argsModel.fields.length ? `args: Mutation${pascalCase(service.name)}${pascalCase(method.name)}Args` : ``}) => {
    return client.${method.methodType === MethodType.Mutation ? 'mutate' : 'query'}({
      mutation: gql\`
        mutation ${methodName}${method.argsModel.fields.length ? `(
          ${method.argsModel.fields.map(f => `$${f.name}: ${fieldTypeToGraphScalarStringified(f as ScalarField)}`).join(`,
          `)}
        )` : ``} {
          ${methodName}${method.argsModel.fields.length ? `(
            ${method.argsModel.fields.map(f => `${f.name}: $${f.name}`).join(`,
            `)}
          )` : ``}${method.returnModel.fields.length ? ` {
            ${method.returnModel.fields.map(f => f.name).join(`
            `)}
          }` : ``}
        }
      \`,${method.argsModel.fields.length ? `
      variables: args,` : ``}
    });
  },`})).join('\n')}
});

export default getAdditionalMethods;
`;
}
