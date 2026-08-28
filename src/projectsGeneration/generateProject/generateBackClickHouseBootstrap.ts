import {ProjectWideGenerationArgs} from '../args'
import { FileCreator } from './types';
import {genClickHouseJobsTmpl} from '../generators/fileTemplates/back/clickhouse/jobs';
import {addWarnings} from './fileHandlers';
import {entityUsesClickHouseBootstrap} from '../builders/storage';
import {
  GenerationPathCategory,
  resolveGenerationPath,
} from '../builders/generationPaths'

export const generateBackClickHouseBootstrap = (fileCreator: FileCreator, args: ProjectWideGenerationArgs) => {
  const entities = args.entities.filter((e) => entityUsesClickHouseBootstrap(e.storage))

  if (entities.length === 0) {
    return
  }

  fileCreator.create(
    resolveGenerationPath({
      category: GenerationPathCategory.BackInitClickHouseGenJobs,
      detachedBackProject: args.options.detachedBackProject,
      detachedUiProject: args.options.detachedUiProject,
      pathsConfig: args.system.generationPaths,
      vars: {},
    }),
    genClickHouseJobsTmpl(entities, args.options),
    addWarnings({options: args.options})
  )
}
