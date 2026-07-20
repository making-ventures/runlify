import {FileCreator} from '../../types'
import {pascalSingular} from '../../../../utils/cases'
import {EntityWideGenerationArgs} from '../../../args'
import {uiGetEntityValidationTmpl} from '../../../generators/fileTemplates/ui/pages/getEntityValidation'
import {addWarnings} from '../../fileHandlers'
import {
  GenerationPathCategory,
  resolveGenerationPath,
} from '../../../builders/generationPaths'

const generateFrontSrcGetEntityValidation = (
  fileCreator: FileCreator,
  args: EntityWideGenerationArgs,
) => {
  const {
    entity: { name },
    options,
    system,
  } = args

  const filePath = resolveGenerationPath({
    category: GenerationPathCategory.UiPageValidation,
    detachedBackProject: options.detachedBackProject,
    detachedUiProject: options.detachedUiProject,
    pathsConfig: system.generationPaths,
    vars: {
      entityName: name,
      pascalSingular: pascalSingular(name),
    },
  })

  fileCreator.create(
    filePath,
    uiGetEntityValidationTmpl(args),
    addWarnings({options: args.options})
  )
}

export default generateFrontSrcGetEntityValidation;
