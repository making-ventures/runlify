import {join} from 'path'
import {FileCreator} from '../types'
import {ProjectWideGenerationArgs} from '../../args'
import {backDefaultEnv} from '../../generators/fileTemplates/back/environment/defaultEnv'

const generateBackEnvs = (fileCreator: FileCreator, args: ProjectWideGenerationArgs) => {
  const filePath = join(
    args.options.detachedBackProject,
    'config',
    'default.json'
  )

  fileCreator.create(filePath, backDefaultEnv(args))
}

export default generateBackEnvs;
