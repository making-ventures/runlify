import {AdditionalServiceWideGenerationArgs} from '../../../../../args'
import {printWarningIfRequired} from '../../../../../utils'
import { backAdditionalServiceTypesTmplInner } from './backAdditionalServiceTypesTmplInner'

export const backAdditionalServiceTypesTmpl = ({
  service,
  options,
}: AdditionalServiceWideGenerationArgs) => `${printWarningIfRequired(options)}
${backAdditionalServiceTypesTmplInner(service)}

`.trimStart()
