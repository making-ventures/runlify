import {ProjectWideGenerationArgs} from '../../../../args'
import {FileCreator} from '../../../../types';
import {genJobsTmpl} from './jobs';
import {join} from 'path';


export const generateBackElasticBootstrap = async (fileCreator: FileCreator, args: ProjectWideGenerationArgs) => {
  const entities = args.entities.filter((e) => e.externalSearch || e.elasticOnly)

  await fileCreator.create(
    join(
      args.options.detachedBackProject,
      `src/init/elastic/genJobs.ts`
    ),
    genJobsTmpl(entities, args.options),
  )
}
