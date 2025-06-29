import {join} from 'path'
import {FileCreator} from '../../types'
import {uiEntityIconTmpl} from '../../../generators/fileTemplates/ui/pages/Icon'
import {pascalSingular} from '../../../../utils/cases'
import {EntityWideGenerationArgs} from '../../../args'

const generateFrontSrcEntityIcon = (
  fileCreator: FileCreator,
  args: EntityWideGenerationArgs,
) => {
  const {
    entity: { name },
  } = args

  const filePath = join(
    args.options.detachedUiProject,
    `src/adm/pages/${name}/${pascalSingular(name)}Icon.tsx`
  )

  fileCreator.create(filePath, uiEntityIconTmpl(args))
}

export default generateFrontSrcEntityIcon;
