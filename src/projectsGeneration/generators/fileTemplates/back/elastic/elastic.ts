import {ProjectWideGenerationArgs} from '../../../../args'
import {genJobsTmpl} from './jobs';
import {write} from 'fs-jetpack';
import {join} from 'path';


export const generateBackElasticBootstrap = async (args: ProjectWideGenerationArgs) => {
  const entities = args.entities.filter((e) => e.externalSearch || e.elasticOnly)

  await write(
    join(
      args.options.detachedBackProject,
      `src/init/elastic/genJobs.ts`
    ),
    genJobsTmpl(entities, args.options),
  )
}
