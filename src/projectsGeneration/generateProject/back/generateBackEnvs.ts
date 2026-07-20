import {FileCreator} from '../types'
import {ProjectWideGenerationArgs} from '../../args'
import {backDefaultEnv} from '../../generators/fileTemplates/back/environment/defaultEnv'
import {
  GenerationPathCategory,
  resolveGenerationPath,
} from '../../builders/generationPaths'

const generateBackEnvs = (fileCreator: FileCreator, args: ProjectWideGenerationArgs) => {
  const filePath = resolveGenerationPath({
    category: GenerationPathCategory.BackConfigDefaultJson,
    detachedBackProject: args.options.detachedBackProject,
    detachedUiProject: args.options.detachedUiProject,
    pathsConfig: args.system.generationPaths,
    vars: {},
  })

  fileCreator.create(filePath, backDefaultEnv(args))
}

export default generateBackEnvs;
