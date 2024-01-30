import { camel } from '../../../../../../../utils/cases'
import {
  BootstrapEntityOptions,
  defaultBootstrapEntityOptions,
} from '../../../../../../types'
import { Entity } from '../../../../../../builders/buildedTypes'
import { generatedWarning } from '../../../../../../utils'
import { getKeyField } from '../../../../../../metaUtils'

export const uiDataProviderTmpl = (
  entities: Entity[],
  options: BootstrapEntityOptions = defaultBootstrapEntityOptions
) => `import buildGraphQLProvider, {buildQuery as buildQueryFactory} from 'ra-data-graphql-simple';
import {IntrospectionResult} from 'ra-data-graphql';
import {DELETE} from 'ra-core';
import gql from 'graphql-tag';
import {IntrospectionType, IntrospectionSchema} from 'graphql';
import {mapping} from '../adm/entityMapping';
import sch from '../generated/graphql.schema.json';
import {ApolloClient} from '@apollo/client';
import getCustomMethods from './getCustomMethods';
import getAdditionalMethods from './getAdditionalMethods';
import {DataProvider} from './types';
${
  options.skipWarningThisIsGenerated
    ? ''
    : `
// ${generatedWarning}
`
}
const schema = sch.__schema;

const getGqlResource = (resource: string) => {
  if (resource in mapping) {
    return mapping[resource as keyof typeof mapping];
  } else {
    throw new Error(\`Unknown resource \${resource}\`);
  }
};

const numberIdResources: string[] = [
  ${entities
    .filter(
      (m) => getKeyField(m).type === 'bigint' || getKeyField(m).type === 'int'
    )
    .map((m) => `'${camel(m.name)}',`).join(`
  `)}
];

const customBuildQuery = (introspection: IntrospectionResult) =>
  (fetchType: string, originalResource: string, params: any) => {
    const resource = getGqlResource(originalResource);

    const builtQuery = buildQueryFactory(introspection)(fetchType, resource, params);

    if (numberIdResources.includes(resource) && fetchType === 'GET_ONE' && 'id' in params) {
      params.id = Number.parseInt(params.id, 10);
    }

    if (resource === 'Command' && fetchType === 'GET_ONE') {
      return {
      // Use the default query variables and parseResponse
        ...builtQuery,

        // Override the query
        query: gql\`
          query Command($id: ID!) {
              data: Command(id: $id) {
                  id
                  reference
                  customer {
                      id
                      firstName
                      lastName
                  }
              }
          }
        \`,
      };
    }

    return builtQuery;
  };

export default async (client: ApolloClient<unknown>): Promise<DataProvider> => {
  const baseDataProvider = await buildGraphQLProvider({
    buildQuery: customBuildQuery,
    client: client as any,
    introspection: {
      schema: schema as unknown as IntrospectionSchema,
      operationNames: {
        [DELETE]: (resource: IntrospectionType) =>
          \`remove\${resource.name}\`,
      },
    },
  });

  return {
    ...baseDataProvider,
    ...getCustomMethods(client, baseDataProvider),
    ...getAdditionalMethods(client),
  };
};
`
