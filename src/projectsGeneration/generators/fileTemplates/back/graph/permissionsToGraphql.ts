import {
  BootstrapEntityOptions,
  defaultBootstrapEntityOptions,
} from '../../../../types'
import { addComma, generatedWarning } from '../../../../utils'
import { ProjectWideGenerationArgs } from '../../../../args'

export const backPermissionToGraphqlTmpl = (
  { entities }: ProjectWideGenerationArgs,
  options: BootstrapEntityOptions = defaultBootstrapEntityOptions
) => `import * as R from 'ramda';
import {additionalServicesPermissionToGraphql} from './additionalServicesPermissionToGraphql';
import {MutationResolvers, QueryResolvers} from '../../generated/graphql';
import {Services} from '../services/types';
import helpPermissionToGraphql from './services/help/permissionsToGraphql';
${entities.map(
  (m) =>
    `import ${m.name}PermissionToGraphql from './services/${m.name}/permissionsToGraphql';`
).join(`
`)}
${
  options.skipWarningThisIsGenerated
    ? ''
    : `
// ${generatedWarning}
`
}
type queryFiles = keyof QueryResolvers;
type mutationFiles = keyof MutationResolvers;

export type PermissionToGraphql <T = any> = Record<
  keyof T,
  queryFiles | mutationFiles
>

export const permissionsToGraphql: Partial<Record<keyof Services, Partial<PermissionToGraphql>>> = {
  ...additionalServicesPermissionToGraphql,
  help: helpPermissionToGraphql,
  ${entities.map((m) => `${m.name}: ${m.name}PermissionToGraphql`).map(addComma)
    .join(`
  `)}
};

const flattenPermissionToGraphqlRaw = R.unnest(
  R.toPairs(permissionsToGraphql)
    .filter(([, mapping]) => mapping)
    .map(
      ([service, mapping]) =>
        R
          .toPairs(mapping as Partial<PermissionToGraphql<any>>)
          .map(
            ([serviceMethod, graphqlMethod]) => [\`\${service}.\${String(serviceMethod)}\`, graphqlMethod],
          ),
    ),
) as R.KeyValuePair<string, string>[];

export const flattenPermissionToGraphql = R.fromPairs(flattenPermissionToGraphqlRaw);

export const flattenGraphqlToPermission = R.fromPairs(
  flattenPermissionToGraphqlRaw.map(
    ([permission, graphql]) => [graphql, permission],
  ),
);
`
