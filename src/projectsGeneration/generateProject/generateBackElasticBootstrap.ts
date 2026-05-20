import {ProjectWideGenerationArgs} from '../args'
import { FileCreator } from './types';
import {genJobsTmpl} from '../generators/fileTemplates/back/elastic/jobs';
import {join} from 'path';
import {addWarnings} from './fileHandlers';
import {entityUsesElasticBootstrap} from '../builders/storage';

export const generateBackElasticBootstrap = (fileCreator: FileCreator, args: ProjectWideGenerationArgs) => {
  const entities = args.entities.filter((e) => entityUsesElasticBootstrap(e.storage))

  fileCreator.create(
    join(
      args.options.detachedBackProject,
      `src/init/elastic/genJobs.ts`
    ),
    genJobsTmpl(entities, args.options),
    addWarnings({options: args.options})
  )
}
