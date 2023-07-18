import { EntityWideGenerationArgs } from '../../../../args'
import { generatedWarning } from '../../../../utils'

export const uiEntityIconTmpl = ({
  options,
  entity,
}: EntityWideGenerationArgs) => `export {default} from '@mui/icons-material/${
  entity.materialUiIcon
}';
${
  options.skipWarningThisIsGenerated
    ? ''
    : `
// ${generatedWarning}
`
}`
