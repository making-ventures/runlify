import {join} from 'path'
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

const generateBackDocsConfiguration = (
  fileCreator: FileCreator,
  args: ProjectWideGenerationArgs,
) => {
  const filePath = join(
    args.options.detachedBackProject,
    'docs',
    'configuration.md'
  )

  fileCreator.create(filePath, backDocsConfiguration(args))
}

const generateBackDocsSpec = (
  fileCreator: FileCreator,
  args: ProjectWideGenerationArgs,
) => {
  const filePath = join(
    args.options.detachedBackProject,
    'docs',
    'spec.md'
  )

  fileCreator.create(filePath, backDocSpec(args))
}

const generateBackDocsRestApis = (
  fileCreator: FileCreator,
  args: ProjectWideGenerationArgs,
) => {
  for (const restApi of args.system.restApis) {
    const filePath = join(
      args.options.detachedBackProject,
      'docs',
      'restApis',
      `${restApi.name}.md`
    )

    fileCreator.create(filePath, backDocsRestApi(args, restApi))
  }
}

const generateBackDocsIntegrationClients = (
  fileCreator: FileCreator,
  args: ProjectWideGenerationArgs,
) => {
  for (const client of args.system.integrationClients) {
    const filePath = join(
      args.options.detachedBackProject,
      'docs',
      'integrationClients',
      `${client.name}.md`
    )

    fileCreator.create(filePath, backDocsIntegrationClient(args, client))
  }
}

const generateBackDocsEntities = (
  fileCreator: FileCreator,
  args: ProjectWideGenerationArgs,
) => {
  args.entities.forEach((entity) => {
    const filePath = join(
      args.options.detachedBackProject,
      'docs',
      plural(entity.type),
      `${entity.name}.md`
    )

    fileCreator.create(
      filePath,
      backDocsEntity(prepareEntityWideGenerationArgs(args, entity))
    )
  })
}

const generateAdminAppDocsConfiguration = (
  fileCreator: FileCreator,
  args: ProjectWideGenerationArgs,
) => {
  const filePath = join(
    args.options.detachedUiProject,
    'docs',
    'configuration.md'
  )

  fileCreator.create(filePath, adminAppDocsConfiguration(args))
}

const generateBackDocs = (fileCreator: FileCreator, args: ProjectWideGenerationArgs) => {
  generateBackDocsSpec(fileCreator, args);
  generateBackDocsConfiguration(fileCreator, args);
  generateBackDocsRestApis(fileCreator, args);
  generateBackDocsIntegrationClients(fileCreator, args);
  generateBackDocsEntities(fileCreator, args);
  generateAdminAppDocsConfiguration(fileCreator, args);
}

export default generateBackDocs;
