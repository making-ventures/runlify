import {AdditionalServiceWideGenerationArgs} from '../../../../../args'
import {backAdditionalServiceTypesTmplInner} from './backAdditionalServiceTypesTmplInner'

export const backAdditionalServiceTypesTmpl = ({
  service,
}: AdditionalServiceWideGenerationArgs) => `${backAdditionalServiceTypesTmplInner(service)}

`.trimStart()
