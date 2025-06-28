import {ProjectWideGenerationArgs} from '../../../../../args'
import {printWarningIfRequired} from '../../../../../utils'

export const chartTmpl = ({
  system: { prefix },
  options,
}: ProjectWideGenerationArgs): string => `${printWarningIfRequired(options, 'hash')}
apiVersion: v1
appVersion: "1.0"
description: A Helm chart for Kubernetes
name: ${options.k8sChartName || prefix}-back
version: 0.0.1
`.trimStart()
