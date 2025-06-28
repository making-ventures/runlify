import {ProjectWideGenerationArgs} from '../../../../args'
import {FileWriter} from '../../../../types';
import {genJobsTmpl} from './jobs';
import {join} from 'path';


export const generateBackElasticBootstrap = async (fileWriter: FileWriter, args: ProjectWideGenerationArgs) => {
  const entities = args.entities.filter((e) => e.externalSearch || e.elasticOnly)

  await fileWriter.write(
    join(
      args.options.detachedBackProject,
      `src/init/elastic/genJobs.ts`
    ),
    genJobsTmpl(entities, args.options),
  )
}
