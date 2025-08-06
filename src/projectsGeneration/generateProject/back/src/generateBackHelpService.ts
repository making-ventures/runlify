import {join} from 'path'
import {FileCreator} from '../../types'
import {ProjectWideGenerationArgs} from '../../../args'
import baseResolversTmpl from '../../../generators/fileTemplates/back/graph/help/baseResolvers'
import helpServiceTmpl from '../../../generators/fileTemplates/back/services/HelpService/HelpService'
import baseTypeDefsTmpl from '../../../generators/fileTemplates/back/graph/help/baseTypeDefs'
import permissionsToGraphqlTmpl from '../../../generators/fileTemplates/back/graph/help/permissionsToGraphql'
import {addWarnings} from '../../fileHandlers'

const generateBackHelpService = (
  fileCreator: FileCreator,
  args: ProjectWideGenerationArgs,
) => {
  fileCreator.create(
    join(
      args.options.detachedBackProject,
      'src',
      'adm',
      'graph',
      'services',
      'help',
      'baseTypeDefs.ts'
    ),
    baseTypeDefsTmpl(args),
    addWarnings({options: args.options})
  )

  if (!args.options.typesOnly) {
    fileCreator.create(
      join(
        args.options.detachedBackProject,
        'src',
        'adm',
        'graph',
        'services',
        'help',
        'baseResolvers.ts'
      ),
      baseResolversTmpl(),
      addWarnings({options: args.options})
    )

    fileCreator.create(
      join(
        args.options.detachedBackProject,
        'src',
        'adm',
        'graph',
        'services',
        'help',
        'permissionsToGraphql.ts'
      ),
      permissionsToGraphqlTmpl(),
      addWarnings({options: args.options})
    )

    fileCreator.create(
      join(
        args.options.detachedBackProject,
        'src',
        'adm',
        'services',
        'HelpService',
        'HelpService.ts'
      ),
      helpServiceTmpl(args),
      addWarnings({options: args.options})
    )
  }
}

export default generateBackHelpService;
