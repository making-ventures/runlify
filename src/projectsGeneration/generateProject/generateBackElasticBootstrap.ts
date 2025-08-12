import {ProjectWideGenerationArgs} from '../args'
import { FileCreator } from './types';
import {genJobsTmpl} from '../generators/fileTemplates/back/elastic/jobs';
import {join} from 'path';
import {addWarnings} from './fileHandlers';

export const generateBackElasticBootstrap = (fileCreator: FileCreator, args: ProjectWideGenerationArgs) => {
  const entities = args.entities.filter((e) => e.externalSearch || e.elasticOnly)

  fileCreator.create(
    join(
      args.options.detachedBackProject,
      `src/init/elastic/genJobs.ts`
    ),
    genJobsTmpl(entities, args.options),
    addWarnings({options: args.options})
  )
}
