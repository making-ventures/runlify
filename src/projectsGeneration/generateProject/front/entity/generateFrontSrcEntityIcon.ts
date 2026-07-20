import {FileCreator} from '../../types'
import {uiEntityIconTmpl} from '../../../generators/fileTemplates/ui/pages/Icon'
import {pascalSingular} from '../../../../utils/cases'
import {EntityWideGenerationArgs} from '../../../args'
import {addWarnings} from '../../fileHandlers'
import {
  GenerationPathCategory,
  resolveGenerationPath,
} from '../../../builders/generationPaths'

const generateFrontSrcEntityIcon = (
  fileCreator: FileCreator,
  args: EntityWideGenerationArgs,
) => {
  const {
    entity: { name },
    options,
    system,
  } = args

  const filePath = resolveGenerationPath({
    category: GenerationPathCategory.UiPageIcon,
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
    uiEntityIconTmpl(args),
    addWarnings({options: args.options})
  )
}

export default generateFrontSrcEntityIcon;
