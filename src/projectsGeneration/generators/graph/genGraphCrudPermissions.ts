import {pascalPlural, pascalSingular} from '../../../utils/cases'
import {Entity} from '../../builders/buildedTypes'

export interface GraphCrudPermissionToGraphql {
  meta: string
  get: string
  all: string
  create: string
  update: string
  delete: string
}

// Mechanical in-memory transcription of backBasePermissionToGraphqlTmpl
// (generators/fileTemplates/back/graph/entityBasePermissionToGraphql.ts) —
// kept in sync by graphSchemaModeParity.spec.ts. Deliberately has no rePost
// entry: the file-mode equivalent (permissionsToGraphql.ts) never gains one
// either — backEntityPermissionToGraphqlTmpl only ever spreads the base map.
export const genGraphCrudPermissions = (
  entity: Entity
): GraphCrudPermissionToGraphql => ({
  meta: `_all${pascalPlural(entity.name)}Meta`,
  get: pascalSingular(entity.name),
  all: `all${pascalPlural(entity.name)}`,
  create: `create${pascalSingular(entity.name)}`,
  update: `update${pascalSingular(entity.name)}`,
  delete: `remove${pascalSingular(entity.name)}`,
})
