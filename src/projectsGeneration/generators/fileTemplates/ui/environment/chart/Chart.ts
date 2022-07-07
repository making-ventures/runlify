import { ProjectWideGenerationArgs } from '../../../../../args'
import { generatedWarning } from '../../../../../utils'

export const uiChartTmpl = ({
  system: { prefix },
  options,
}: ProjectWideGenerationArgs) => `${
  options.skipWarningThisIsGenerated
    ? ''
    : `
# ${generatedWarning}
`
}apiVersion: v1
appVersion: "1.0"
description: A Helm chart for Kubernetes
name: ${options.k8sChartName || prefix}-ui
version: 0.0.1
`
