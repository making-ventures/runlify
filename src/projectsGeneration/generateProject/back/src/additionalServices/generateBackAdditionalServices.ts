import {FileCreator} from '../../../types'
import {
  prepareAdditionalServiceWideGenerationArgs,
  ProjectWideGenerationArgs,
} from '../../../../args'
import generateBackAdditionalService from './generateBackAdditionalService'
import { additionalServicesTmpl } from '../../../../generators/fileTemplates/back/services/AdditionalServices'
import {
  GenerationPathCategory,
  resolveGenerationPath,
} from '../../../../builders/generationPaths'

const generateBackAdditionalServices = (fileCreator: FileCreator, args: ProjectWideGenerationArgs) => {
  args.additionalServices.forEach((service) =>
    generateBackAdditionalService(fileCreator, prepareAdditionalServiceWideGenerationArgs(args, service))
  );

  fileCreator.createIfNotExists(
    resolveGenerationPath({
      category: GenerationPathCategory.BackAdditionalServices,
      detachedBackProject: args.options.detachedBackProject,
      detachedUiProject: args.options.detachedUiProject,
      pathsConfig: args.system.generationPaths,
      vars: {},
    }),
    additionalServicesTmpl()
  );
}

export default generateBackAdditionalServices;
