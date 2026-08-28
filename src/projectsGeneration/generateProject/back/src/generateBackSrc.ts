import { FileCreator } from '../../types'
import { configItemsTmpl } from '../../../generators/fileTemplates/back/root/config/config'
import { ProjectWideGenerationArgs } from '../../../args'
import generateBackEnumsAndInits from './enums/generateBackEnumsAndInits'
import generateBackHelpService from './generateBackHelpService'
import generateBackIntegrationClients from './generateBackIntegrationClients'
import generateBackAdditionalServices from './additionalServices/generateBackAdditionalServices'
import generateBackServices from './services/generateBackServices'
import { backPermissionToGraphqlTmpl } from '../../../generators/fileTemplates/back/graph/permissionsToGraphql'
import { restRouterTmpl } from '../../../generators/fileTemplates/back/root/restRouter'
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
import { backInitPermissionsTmpl } from '../../../generators/fileTemplates/back/roles/initPermissions'
import { backUiPermissionsTmpl } from '../../../generators/fileTemplates/back/roles/uiPermissions'
import { backCustomPermissionsTmpl } from '../../../generators/fileTemplates/back/roles/customPermissions'
import { backCustomUiPermissionsTmpl } from '../../../generators/fileTemplates/back/roles/customUiPermissions'
import { addWarnings, addGeneratedOnceNotice } from '../../fileHandlers'

const generateBackSrc = (
  fileCreator: FileCreator,
  args: ProjectWideGenerationArgs,
) => {
  if (!args.options.typesOnly) {
    fileCreator.create(
      resolveBackPath(args, GenerationPathCategory.BackConfig),
      configItemsTmpl(args),
      addWarnings({ options: args.options }),
    )

    generateBackEnumsAndInits(fileCreator, args)
  }

  generateBackServices(fileCreator, args)
  generateBackIntegrationClients(fileCreator, args)
  generateBackAdditionalServices(fileCreator, args)

  generateBackHelpService(fileCreator, args)

  // Graph
  fileCreator.create(
    resolveBackPath(args, GenerationPathCategory.BackGraphPermissionsToGraphql),
    backPermissionToGraphqlTmpl(args),
    addWarnings({ options: args.options }),
  )

  // Root
  fileCreator.createIfNotExists(
    resolveBackPath(args, GenerationPathCategory.BackRestRouter),
    restRouterTmpl(),
  )
  
  // Roles/permissions
  fileCreator.create(
    resolveBackPath(args, GenerationPathCategory.BackRolesInitPermissions),
    backInitPermissionsTmpl(),
    addWarnings({ options: args.options }),
  )
  fileCreator.create(
    resolveBackPath(args, GenerationPathCategory.BackRolesUiPermissions),
    backUiPermissionsTmpl(args),
    addWarnings({ options: args.options }),
  )
  fileCreator.createIfNotExists(
    resolveBackPath(args, GenerationPathCategory.BackRolesCustomPermissions),
    backCustomPermissionsTmpl(),
    [addGeneratedOnceNotice],
  )
  fileCreator.createIfNotExists(
    resolveBackPath(args, GenerationPathCategory.BackRolesCustomUiPermissions),
    backCustomUiPermissionsTmpl(),
    [addGeneratedOnceNotice],
  )
}

export default generateBackSrc
