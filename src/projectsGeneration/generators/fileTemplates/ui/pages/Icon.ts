import {EntityWideGenerationArgs} from '../../../../args'
import {printWarningIfRequired} from '../../../../utils'

export const uiEntityIconTmpl = ({
  options,
  entity,
}: EntityWideGenerationArgs) => `export {default} from '@mui/icons-material/${
  entity.materialUiIcon
}';
${printWarningIfRequired(options)}`
