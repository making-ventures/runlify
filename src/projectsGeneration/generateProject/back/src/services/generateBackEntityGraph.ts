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
import {
  GenerationPathCategory,
  resolveGenerationPath,
} from '../../../../builders/generationPaths'

const generateBackEntityGraph = (
  fileCreator: FileCreator,
  args: EntityWideGenerationArgs,
) => {
  const {
    entity,
    options,
    system,
  } = args;

  const resolveGraphPath = (category: GenerationPathCategory) =>
    resolveGenerationPath({
      category,
      detachedBackProject: options.detachedBackProject,
      detachedUiProject: options.detachedUiProject,
      pathsConfig: system.generationPaths,
      vars: {camelPlural: camelPlural(entity.name)},
    });

  // Graph schema
  if (options.genGraphSchema) {
    fileCreator.create(
      resolveGraphPath(GenerationPathCategory.BackGraphEntityBaseTypeDefs),
      backBaseTypesTmpl(printSchema(genGraphCrudSchema(entity)), options),
      addWarnings({options})
    );

    fileCreator.createIfNotExists(
      resolveGraphPath(GenerationPathCategory.BackGraphEntityAdditionalTypeDefs),
      backAdditionalTypesTmpl()
    );
  }

  if (!options.typesOnly) {
    // Graph resolvers
    if (options.genGraphResolvers) {
      fileCreator.create(
        resolveGraphPath(GenerationPathCategory.BackGraphEntityBaseResolvers),
        backBaseResolversTmpl(args),
        addWarnings({options})
      );
      fileCreator.createIfNotExists(
        resolveGraphPath(GenerationPathCategory.BackGraphEntityAdditionalResolvers),
        backAdditionalResolversTmpl()
      );
    }

    // Permissions
    fileCreator.create(
      resolveGraphPath(GenerationPathCategory.BackGraphEntityPermissionsToGraphql),
      backEntityPermissionToGraphqlTmpl(args),
      addWarnings({options})
    );
    fileCreator.create(
      resolveGraphPath(GenerationPathCategory.BackGraphEntityBasePermissionsToGraphql),
      backBasePermissionToGraphqlTmpl(args),
      addWarnings({options})
    );
    fileCreator.create(
      resolveGraphPath(GenerationPathCategory.BackGraphEntityAdditionalPermissionsToGraphql),
      backEntityAdditionalPermissionToGraphqlTmpl(args),
      addWarnings({options})
    );
  }
}

export default generateBackEntityGraph;
