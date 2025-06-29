import {join} from 'path'
import {FileCreator} from '../../../types'
import {camelPlural} from '../../../../../utils/cases'
import {EntityWideGenerationArgs} from '../../../../args'
import {backBaseTypesTmpl} from '../../../../generators/fileTemplates/back/graph/types'
import {backBaseResolversTmpl} from '../../../../generators/fileTemplates/back/graph/resolvers'
import {genGraphCrudSchema} from '../../../../generators/graph/genGraphCrudSchema'
import {printSchema} from 'graphql'
import {backAdditionalResolversTmpl} from '../../../../generators/fileTemplates/back/graph/additionalResolvers'
import {backEntityPermissionToGraphqlTmpl} from '../../../../generators/fileTemplates/back/graph/entityPermissionToGraphqlTmpl'
import {backEntityAdditionalPermissionToGraphqlTmpl} from '../../../../generators/fileTemplates/back/graph/entityAdditionalPermissionToGraphqlTmpl'
import {backBasePermissionToGraphqlTmpl} from '../../../../generators/fileTemplates/back/graph/entityBasePermissionToGraphql'
import {backAdditionalTypesTmpl} from '../../../../generators/fileTemplates/back/graph/additionalTypes'

const generateBackEntityGraph = (
  fileCreator: FileCreator,
  args: EntityWideGenerationArgs,
) => {
  const {
    entity,
    options,
  } = args;

  const graphServiceDir = join(
    options.detachedBackProject,
    'src',
    'adm',
    'graph',
    'services',
    camelPlural(entity.name)
  );

  // Graph schema
  if (options.genGraphSchema) {
    fileCreator.create(
      join(graphServiceDir, 'baseTypeDefs.ts'),
      backBaseTypesTmpl(printSchema(genGraphCrudSchema(entity)), options)
    );

    fileCreator.createIfNotExists(
      join(graphServiceDir, 'additionalTypeDefs.ts'),
      backAdditionalTypesTmpl()
    );
  }

  if (!options.typesOnly) {
    // Graph resolvers
    if (options.genGraphResolvers) {
      fileCreator.create(
        `${graphServiceDir}/baseResolvers.ts`,
        backBaseResolversTmpl(args)
      );
      fileCreator.createIfNotExists(
        `${graphServiceDir}/additionalResolvers.ts`,
        backAdditionalResolversTmpl()
      );
    }

    // Permissions
    fileCreator.create(
      `${graphServiceDir}/permissionsToGraphql.ts`,
      backEntityPermissionToGraphqlTmpl(args)
    );
    fileCreator.create(
      `${graphServiceDir}/basePermissionsToGraphql.ts`,
      backBasePermissionToGraphqlTmpl(args)
    );
    fileCreator.create(
      `${graphServiceDir}/additionalPermissionsToGraphql.ts`,
      backEntityAdditionalPermissionToGraphqlTmpl(args)
    );
  }
}

export default generateBackEntityGraph;
