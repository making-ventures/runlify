import {FileCreator} from '../../types'
import {ProjectWideGenerationArgs} from '../../../args'
import baseResolversTmpl from '../../../generators/fileTemplates/back/graph/help/baseResolvers'
import helpServiceTmpl from '../../../generators/fileTemplates/back/services/HelpService/HelpService'
import baseTypeDefsTmpl from '../../../generators/fileTemplates/back/graph/help/baseTypeDefs'
import permissionsToGraphqlTmpl from '../../../generators/fileTemplates/back/graph/help/permissionsToGraphql'
import {addWarnings} from '../../fileHandlers'
import {
  GenerationPathCategory,
  resolveGenerationPath,
} from '../../../builders/generationPaths'

const resolveBackPath = (
  args: ProjectWideGenerationArgs,
  category: GenerationPathCategory,
) =>
  resolveGenerationPath({
    category,
    detachedBackProject: args.options.detachedBackProject,
    detachedUiProject: args.options.detachedUiProject,
    pathsConfig: args.system.generationPaths,
    vars: {},
  })

const generateBackHelpService = (
  fileCreator: FileCreator,
  args: ProjectWideGenerationArgs,
) => {
  fileCreator.create(
    resolveBackPath(args, GenerationPathCategory.BackGraphHelpBaseTypeDefs),
    baseTypeDefsTmpl(args),
    addWarnings({options: args.options})
  )

  if (!args.options.typesOnly) {
    fileCreator.create(
      resolveBackPath(args, GenerationPathCategory.BackGraphHelpBaseResolvers),
      baseResolversTmpl(),
      addWarnings({options: args.options})
    )

    fileCreator.create(
      resolveBackPath(args, GenerationPathCategory.BackGraphHelpPermissionsToGraphql),
      permissionsToGraphqlTmpl(),
      addWarnings({options: args.options})
    )

    fileCreator.create(
      resolveBackPath(args, GenerationPathCategory.BackServiceHelpService),
      helpServiceTmpl(args),
      addWarnings({options: args.options})
    )
  }
}

export default generateBackHelpService;
