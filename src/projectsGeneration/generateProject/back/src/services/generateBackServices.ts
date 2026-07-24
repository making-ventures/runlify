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
import {
  GenerationPathCategory,
  resolveGenerationPath,
} from '../../../../builders/generationPaths'

const generateBackServices = (fileCreator: FileCreator, args: ProjectWideGenerationArgs) => {
  args.entities.forEach((entity) => {
    generateBackEntityService(fileCreator, prepareEntityWideGenerationArgs(args, entity));
    generateBackEntityGraph(fileCreator, prepareEntityWideGenerationArgs(args, entity));
  });

  if (args.options.genContext) {
    const resolveBackPath = (category: GenerationPathCategory) =>
      resolveGenerationPath({
        category,
        detachedBackProject: args.options.detachedBackProject,
        detachedUiProject: args.options.detachedUiProject,
        pathsConfig: args.system.generationPaths,
        vars: {},
      });

    // Types
    fileCreator.create(
      resolveBackPath(GenerationPathCategory.BackServiceBaseServices),
      graphBaseServicesTmpl(args),
      addWarnings({options: args.options})
    );
    // Constructors
    fileCreator.create(
      resolveBackPath(GenerationPathCategory.BackServiceServiceConstrictors),
      graphServiceConstrictorsTmpl(args),
      addWarnings({options: args.options})
    );
  }
}

export default generateBackServices;
