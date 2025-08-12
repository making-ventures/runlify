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
import {addWarnings} from '../../../fileHandlers'

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
      backBaseTypesTmpl(printSchema(genGraphCrudSchema(entity)), options),
      addWarnings({options})
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
        join(graphServiceDir, 'baseResolvers.ts'),
        backBaseResolversTmpl(args),
        addWarnings({options})
      );
      fileCreator.createIfNotExists(
        join(graphServiceDir, 'additionalResolvers.ts'),
        backAdditionalResolversTmpl()
      );
    }

    // Permissions
    fileCreator.create(
      join(graphServiceDir, 'permissionsToGraphql.ts'),
      backEntityPermissionToGraphqlTmpl(args),
      addWarnings({options})
    );
    fileCreator.create(
      join(graphServiceDir, 'basePermissionsToGraphql.ts'),
      backBasePermissionToGraphqlTmpl(args),
      addWarnings({options})
    );
    fileCreator.create(
      join(graphServiceDir, 'additionalPermissionsToGraphql.ts'),
      backEntityAdditionalPermissionToGraphqlTmpl(args),
      addWarnings({options})
    );
  }
}

export default generateBackEntityGraph;
