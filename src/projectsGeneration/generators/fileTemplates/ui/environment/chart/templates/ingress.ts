/* eslint-disable max-len */
import { ProjectWideGenerationArgs } from '../../../../../../args'
import { generatedWarning } from '../../../../../../utils'

export const uiChartIngressTmpl = ({
  system: { prefix },
  options,
}: ProjectWideGenerationArgs) => `${
  options.skipWarningThisIsGenerated
    ? ''
    : `
# ${generatedWarning}
`
}apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: ${options.k8sChartName || prefix}-ui
  labels:
    app: ${options.k8sChartName || prefix}-back
    chart: "{{ .Chart.Name }}-{{ .Chart.Version | replace "+" "_" }}"
    release: "{{ .Release.Name }}"
    heritage: "{{ .Release.Service }}"
  annotations:
  {{- range $key, $value := .Values.ingress.annotations }}
    {{ $key }}: {{ $value | quote }}
  {{- end }}
  {{ if .Values.ingress.letsencryptCert }}
    cert-manager.io/cluster-issuer: "letsencrypt-prod"
  {{ end }}
spec:
  rules:
    {{ if .Values.ingress.rootEnabled }}
    - host: {{ $.Values.ingress.domains.app }}.apps.{{ $.Values.ingress.host }}
      http:
        paths:
          - pathType: Prefix
            path: "/"
            backend:
              service:
                name: ${options.k8sChartName || prefix}-ui
                port:
                  number: 80
    {{ end }}
    - host: {{ $.Values.ingress.domains.app }}.{{ $.Values.global.env }}.apps.{{ $.Values.global.clusterName }}.{{ $.Values.ingress.host }}
      http:
        paths:
          - pathType: Prefix
            path: "/"
            backend:
              service:
                name: ${options.k8sChartName || prefix}-ui
                port:
                  number: 80
  tls:
  - hosts:
    - {{ $.Values.ingress.domains.app }}.{{ $.Values.global.env }}.apps.{{ $.Values.global.clusterName }}.{{ $.Values.ingress.host }}
    secretName: {{ $.Values.ingress.domains.app }}.{{ $.Values.global.env }}.apps.{{ $.Values.global.clusterName }}.{{ $.Values.ingress.host }}-tls
`
