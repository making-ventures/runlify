import {join} from 'path'
import {FileCreator} from '../../../types'
import {
  prepareEntityWideGenerationArgs,
  ProjectWideGenerationArgs,
} from '../../../../args'
import generateBackEntityService from './generateBackEntityService'
import generateBackEntityGraph from './generateBackEntityGraph'
import graphBaseServicesTmpl from '../../../../generators/fileTemplates/back/services/BaseServices'
import graphServiceConstrictorsTmpl from '../../../../generators/fileTemplates/back/services/serviceConstrictors'
import {addWarnings} from '../../../fileHandlers'

const generateBackServices = (fileCreator: FileCreator, args: ProjectWideGenerationArgs) => {
  const servicesDir = join(args.options.detachedBackProject, 'src', 'adm', 'services');

  args.entities.forEach((entity) => {
    generateBackEntityService(fileCreator, prepareEntityWideGenerationArgs(args, entity));
    generateBackEntityGraph(fileCreator, prepareEntityWideGenerationArgs(args, entity));
  });

  if (args.options.genContext) {
    // Types
    fileCreator.create(
      join(servicesDir, 'BaseServices.ts'),
      graphBaseServicesTmpl(args),
      addWarnings({options: args.options})
    );
    // Constructors
    fileCreator.create(
      join(servicesDir, 'serviceConstrictors.ts'),
      graphServiceConstrictorsTmpl(args),
      addWarnings({options: args.options})
    );
  }
}

export default generateBackServices;
