export const graphMetaTypesTmpl = () => `import {gql} from 'apollo-server';

export default gql\`
  type Query {
    Meta: JSONObject
  }
\`;
`
