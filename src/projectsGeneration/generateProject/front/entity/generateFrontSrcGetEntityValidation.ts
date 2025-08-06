import {join} from 'path'
import {FileCreator} from '../../types'
import {pascalSingular} from '../../../../utils/cases'
import {EntityWideGenerationArgs} from '../../../args'
import {uiGetEntityValidationTmpl} from '../../../generators/fileTemplates/ui/pages/getEntityValidation'
import {addWarnings} from '../../fileHandlers'

const generateFrontSrcGetEntityValidation = (
  fileCreator: FileCreator,
  args: EntityWideGenerationArgs,
) => {
  const {
    entity: { name },
  } = args

  const filePath = join(
    args.options.detachedUiProject,
    `src/adm/pages/${name}/get${pascalSingular(name)}Validation.tsx`
  )

  fileCreator.create(
    filePath,
    uiGetEntityValidationTmpl(args),
    addWarnings({options: args.options})
  )
}

export default generateFrontSrcGetEntityValidation;
