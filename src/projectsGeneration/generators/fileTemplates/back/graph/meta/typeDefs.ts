export const graphMetaTypesTmpl = () => `import gql from 'graphql-tag';

// getEntityIds: () => Promise<string[]>
// getEntityById: (id: string) => Promise<Catalog | Document | InfoRegistry | SumRegistry>
// getEntityIdsLinkedToEntity: (id: string) => Promise<string[]>
// getEntityIdsLinkedFromEntity: (id: string) => Promise<string[]>

export default gql\`
  type Query {
    EntityMeta(id: ID!): JSONObject
    getEntityIds: [String!]!
    getEntityIdsLinkedToEntity(id: ID!): [String!]!
    getEntityIdsLinkedFromEntity(id: ID!): [String!]!
  }
\`;
`
