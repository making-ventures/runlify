import {ProjectWideGenerationArgs} from '../../../../../args'

export const uiChartTmpl = ({
  system: { prefix },
  options,
}: ProjectWideGenerationArgs) => `
apiVersion: v1
appVersion: "1.0"
description: A Helm chart for Kubernetes
name: ${options.k8sChartName || prefix}-ui
version: 0.0.1
`.trimStart()
