import { ProjectWideGenerationArgs } from '../../../../../args'

const baseTypeDefsTmpl = ({
  entities,
}: ProjectWideGenerationArgs) => `import {gql} from 'apollo-server';

export default gql\`
  enum EntityType {
  ${entities.map((m) => `  ${m.name}`).join(`
  `)}
  }

  type Query {
    getHelp(entityType: EntityType!): String!
  }
\`;

`

export default baseTypeDefsTmpl
