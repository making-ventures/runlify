import {FileCreator} from '../../types'
import {ProjectWideGenerationArgs} from '../../../args'
import backIntegrationClientTmpl from '../../../generators/fileTemplates/back/environment/src/integrationClients/IntegrationClient'
import {pascalCase} from 'change-case'
import backIntegrationClientTypesTmpl from '../../../generators/fileTemplates/back/environment/src/integrationClients/types'
import genIntegrationClientConstrictorsTmpl from '../../../generators/fileTemplates/back/environment/src/integrationClients/integrationClientConstrictors'
import genIntegrationClientsTmpl from '../../../generators/fileTemplates/back/environment/src/integrationClients/IntegrationClients'
import {addWarnings} from '../../fileHandlers'
import {
  GenerationPathCategory,
  GenerationPathVars,
  resolveGenerationPath,
} from '../../../builders/generationPaths'

const resolveBackPath = (
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

const generateBackIntegrationClients = (
  fileCreator: FileCreator,
  args: ProjectWideGenerationArgs,
) => {
  for (const client of args.system.integrationClients) {
    const clientVars = {
      clientName: client.name,
      ClientPascal: pascalCase(client.name),
    }

    if (!args.options.typesOnly) {
      fileCreator.createIfNotExists(
        resolveBackPath(args, GenerationPathCategory.BackIntegrationClientClass, clientVars),
        backIntegrationClientTmpl(args, client)
      );
    }

    fileCreator.create(
      resolveBackPath(args, GenerationPathCategory.BackIntegrationClientTypes, clientVars),
      backIntegrationClientTypesTmpl(args, client),
      addWarnings({options: args.options})
    );
  }

  if (!args.options.typesOnly) {
    fileCreator.create(
      resolveBackPath(args, GenerationPathCategory.BackIntegrationClientConstrictors),
      genIntegrationClientConstrictorsTmpl(args),
      addWarnings({options: args.options})
    );
  }

  fileCreator.create(
    resolveBackPath(args, GenerationPathCategory.BackIntegrationClients),
    genIntegrationClientsTmpl(args),
    addWarnings({options: args.options})
  );
}

export default generateBackIntegrationClients;
