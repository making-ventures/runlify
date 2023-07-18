import {
  BootstrapEntityOptions,
  defaultBootstrapEntityOptions,
} from '../../../types'
import { camelPlural, pascalSingular } from '../../../../utils/cases'
import { generatedWarning } from '../../../utils'
import { ProjectWideGenerationArgs } from '../../../args'

export const uiEntityMappingTmpl = (
  { entities }: ProjectWideGenerationArgs,
  options: BootstrapEntityOptions = defaultBootstrapEntityOptions
) => `${
  options.skipWarningThisIsGenerated
    ? ''
    : `// ${generatedWarning}

`
}export const mapping = {
  ${entities.map((m) => `${camelPlural(m.name)}: '${pascalSingular(m.name)}',`)
    .join(`
  `)}
};
`
