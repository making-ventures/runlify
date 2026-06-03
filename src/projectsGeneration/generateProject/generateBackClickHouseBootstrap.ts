import {ProjectWideGenerationArgs} from '../args'
import { FileCreator } from './types';
import {genClickHouseJobsTmpl} from '../generators/fileTemplates/back/clickhouse/jobs';
import {join} from 'path';
import {addWarnings} from './fileHandlers';
import {entityUsesClickHouseBootstrap} from '../builders/storage';

export const generateBackClickHouseBootstrap = (fileCreator: FileCreator, args: ProjectWideGenerationArgs) => {
  const entities = args.entities.filter((e) => entityUsesClickHouseBootstrap(e.storage))

  if (entities.length === 0) {
    return
  }

  fileCreator.create(
    join(
      args.options.detachedBackProject,
      `src/init/clickhouse/genJobs.ts`
    ),
    genClickHouseJobsTmpl(entities, args.options),
    addWarnings({options: args.options})
  )
}
