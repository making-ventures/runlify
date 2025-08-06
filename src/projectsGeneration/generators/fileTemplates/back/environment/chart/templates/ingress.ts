
export const chartIngressTmpl = () => `{{- if .Values.ingress.enabled }}
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: {{ $.Values.global.projectName }}-{{ $.Values.global.deployKind }}
  labels:
    app: {{ $.Values.global.projectName }}-{{ $.Values.global.deployKind }}
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
    - host: {{ $.Values.ingress.domain }}.apps.{{ $.Values.ingress.host }}
      http:
        paths:
          - pathType: Prefix
            path: "/"
            backend:
              service:
                name: {{ $.Values.global.projectName }}-{{ $.Values.global.deployKind }}
                port:
                  number: 3000
    {{ end }}
    - host: {{ $.Values.ingress.domain }}.{{ $.Values.global.env }}.apps.{{ $.Values.global.clusterName }}.{{ $.Values.ingress.host }}
      http:
        paths:
          - pathType: Prefix
            path: "/"
            backend:
              service:
                name: {{ $.Values.global.projectName }}-{{ $.Values.global.deployKind }}
                port:
                  number: 3000
  tls:
  - hosts:
    - {{ $.Values.ingress.domain }}.{{ $.Values.global.env }}.apps.{{ $.Values.global.clusterName }}.{{ $.Values.ingress.host }}
    secretName: {{ $.Values.ingress.domain }}.{{ $.Values.global.env }}.apps.{{ $.Values.global.clusterName }}.{{ $.Values.ingress.host }}-tls
{{- end }}
`
