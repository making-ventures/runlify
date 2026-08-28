import {ProjectWideGenerationArgs} from '../args'
import { FileCreator } from './types';
import {genJobsTmpl} from '../generators/fileTemplates/back/elastic/jobs';
import {addWarnings} from './fileHandlers';
import {entityUsesElasticBootstrap} from '../builders/storage';
import {
  GenerationPathCategory,
  resolveGenerationPath,
} from '../builders/generationPaths'

export const generateBackElasticBootstrap = (fileCreator: FileCreator, args: ProjectWideGenerationArgs) => {
  const entities = args.entities.filter((e) => entityUsesElasticBootstrap(e.storage))

  fileCreator.create(
    resolveGenerationPath({
      category: GenerationPathCategory.BackInitElasticGenJobs,
      detachedBackProject: args.options.detachedBackProject,
      detachedUiProject: args.options.detachedUiProject,
      pathsConfig: args.system.generationPaths,
      vars: {},
    }),
    genJobsTmpl(entities, args.options),
    addWarnings({options: args.options})
  )
}
