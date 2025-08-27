import {addComma} from '../../../../utils'
import {ProjectWideGenerationArgs} from '../../../../args'

export const backPermissionToGraphqlTmpl = (
  {entities}: ProjectWideGenerationArgs,
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

type queryKeys = keyof QueryResolvers;
type mutationKeys = keyof MutationResolvers;

export type PermissionToGraphql <T = any> = Record<
  keyof T,
  queryKeys | mutationKeys
>

export const permissionsToGraphql: Partial<Record<keyof Services, Partial<PermissionToGraphql>>> = {
  ...additionalServicesPermissionToGraphql,
  help: helpPermissionToGraphql,
  ${entities.map((m) => `${m.name}: ${m.name}PermissionToGraphql`).map(addComma)
    .join(`
  `)}
};

const flattenPermissionToGraphql: Map<string, string> = new Map([])
const flattenGraphqlToPermission: Map<string, string> = new Map([])

R.keys(permissionsToGraphql).forEach((service) => {
  const mapping = permissionsToGraphql[service]
  if (!mapping) return

  R.keys(mapping).forEach(serviceMethod => {
    const graphqlMethod = mapping[serviceMethod]
    if (!graphqlMethod) return

    const permission = \`\${service}.\${String(serviceMethod)}\`

    flattenPermissionToGraphql.set(permission, graphqlMethod)
    flattenGraphqlToPermission.set(graphqlMethod, permission)
  })
})

export function permissionToGraphql (permission: string):string | undefined {return flattenPermissionToGraphql.get(permission)}

export function graphqlToPermission (graphql: string):string | undefined {return flattenGraphqlToPermission.get(graphql)}
`
