import {FileCreator} from '../../types'
import {
  prepareEntityWideGenerationArgs,
  ProjectWideGenerationArgs,
} from '../../../args'
import backDocsConfiguration from '../../../generators/fileTemplates/back/environment/docs/backDocsConfiguration'
import {adminAppDocsConfiguration} from '../../../generators/fileTemplates/ui/environment/docs/adminAppDocsConfiguration'
import backDocsRestApi from '../../../generators/fileTemplates/back/environment/docs/backDocsRestApi'
import backDocsEntity from '../../../generators/fileTemplates/back/environment/docs/backDocsEntity'
import {plural} from 'pluralize'
import backDocsIntegrationClient from '../../../generators/fileTemplates/back/environment/docs/backDocsIntegrationClient'
import backDocSpec from '../../../generators/fileTemplates/back/environment/docs/backDocSpec'
import {
  GenerationPathCategory,
  GenerationPathVars,
  resolveGenerationPath,
} from '../../../builders/generationPaths'

const resolveDocsPath = (
  args: ProjectWideGenerationArgs,
  category: GenerationPathCategory,
  vars: GenerationPathVars = {},
) =>
  resolveGenerationPath({
    category,
    detachedBackProject: args.options.detachedBackProject,
    detachedUiProject: args.options.detachedUiProject,
    pathsConfig: args.system.generationPaths,
    vars,
  })

const generateBackDocsConfiguration = (
  fileCreator: FileCreator,
  args: ProjectWideGenerationArgs,
) => {
  fileCreator.create(
    resolveDocsPath(args, GenerationPathCategory.BackDocsConfiguration),
    backDocsConfiguration(args)
  )
}

const generateBackDocsSpec = (
  fileCreator: FileCreator,
  args: ProjectWideGenerationArgs,
) => {
  fileCreator.create(
    resolveDocsPath(args, GenerationPathCategory.BackDocsSpec),
    backDocSpec(args)
  )
}

const generateBackDocsRestApis = (
  fileCreator: FileCreator,
  args: ProjectWideGenerationArgs,
) => {
  for (const restApi of args.system.restApis) {
    fileCreator.create(
      resolveDocsPath(args, GenerationPathCategory.BackDocsRestApi, {
        restApiName: restApi.name,
      }),
      backDocsRestApi(args, restApi)
    )
  }
}

const generateBackDocsIntegrationClients = (
  fileCreator: FileCreator,
  args: ProjectWideGenerationArgs,
) => {
  for (const client of args.system.integrationClients) {
    fileCreator.create(
      resolveDocsPath(args, GenerationPathCategory.BackDocsIntegrationClient, {
        clientName: client.name,
      }),
      backDocsIntegrationClient(args, client)
    )
  }
}

const generateBackDocsEntities = (
  fileCreator: FileCreator,
  args: ProjectWideGenerationArgs,
) => {
  args.entities.forEach((entity) => {
    fileCreator.create(
      resolveDocsPath(args, GenerationPathCategory.BackDocsEntity, {
        entityTypePlural: plural(entity.type),
        entityName: entity.name,
      }),
      backDocsEntity(prepareEntityWideGenerationArgs(args, entity))
    )
  })
}

const generateAdminAppDocsConfiguration = (
  fileCreator: FileCreator,
  args: ProjectWideGenerationArgs,
) => {
  fileCreator.create(
    resolveDocsPath(args, GenerationPathCategory.UiDocsConfiguration),
    adminAppDocsConfiguration(args)
  )
}

const generateBackDocs = (fileCreator: FileCreator, args: ProjectWideGenerationArgs) => {
  generateBackDocsSpec(fileCreator, args);
  generateBackDocsConfiguration(fileCreator, args);
  generateBackDocsRestApis(fileCreator, args);
  generateBackDocsIntegrationClients(fileCreator, args);
  generateBackDocsEntities(fileCreator, args);

  if (args.options.genFrontend !== false) {
    generateAdminAppDocsConfiguration(fileCreator, args);
  }
}

export default generateBackDocs;
