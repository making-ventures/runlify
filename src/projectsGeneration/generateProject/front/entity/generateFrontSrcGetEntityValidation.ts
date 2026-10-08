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
    entity,
    entity: { name },
    options,
    system,
  } = args

  // В режиме descriptor yup-схема строится в рантайме из данных дескриптора.
  if ((entity.forms.uiPagesMode ?? 'legacy') === 'descriptor') {
    return
  }

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
