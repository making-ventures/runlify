/* eslint-disable max-len */
import { constantCase } from 'change-case'
import { ProjectWideGenerationArgs } from '../../../../../../args'
import { generatedWarning } from '../../../../../../utils'

export const uiChartFrontTmpl = ({
  system,
  system: { prefix },
  options,
}: ProjectWideGenerationArgs) => `${
  options.skipWarningThisIsGenerated
    ? ''
    : `
# ${generatedWarning}
`
}apiVersion: v1
kind: Service
metadata:
  name: ${options.k8sChartName || prefix}-ui
  labels:
    app: ${options.k8sChartName || prefix}-ui
    projectName: {{ $.Values.global.projectName }}
    clusterName: {{ $.Values.global.clusterName }}
    env: {{ $.Values.global.env }}
    deployKind: {{ $.Values.global.deployKind }}
spec:
  ports:
  - port: 80
  selector:
    app: ${options.k8sChartName || prefix}-ui
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: ${options.k8sChartName || prefix}-ui
spec:
  replicas: {{ $.Values.app.replicas }}
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: 3
  selector:
    matchLabels:
      app: ${options.k8sChartName || prefix}-ui
  template:
    metadata:
      labels:
        app: ${options.k8sChartName || prefix}-ui
        projectName: {{ $.Values.global.projectName }}
        clusterName: {{ $.Values.global.clusterName }}
        env: {{ $.Values.global.env }}
        deployKind: {{ $.Values.global.deployKind }}
    spec:
    {{- with .Values.imagePullSecrets }}
      imagePullSecrets:
        {{- toYaml . | nindent 8 }}
    {{- end }}
      containers:
      - name: ${options.k8sChartName || prefix}-ui
        image: {{ $.Values.dockerRegistry }}/${
          options.projectPrefix || prefix
        }-ui{{ $.Values.app.tag }}
        ports:
        - name: main-port
          containerPort: 80
        imagePullPolicy: Always
        env:
        - name: RANDOM
          value: {{ $.Values.random | quote }}
        - name: ENV
          value: '{{ $.Values.global.env }}'
        - name: ENDPOINT
          value: 'https://{{ $.Values.ingress.domains.endpoint }}.{{ $.Values.global.env }}.apps.{{ $.Values.global.clusterName }}.{{ $.Values.ingress.host }}/adm'${system.configVars
            .filter((v) => v.scopes.includes('admin-app'))
            .map(
              (v) => `\n        - name: ${constantCase(v.name)}
          value: {{ $.Values.${v.name} | quote }}`
            )
            .join('')}

        livenessProbe:
          httpGet:
            path: /
            port: main-port
          initialDelaySeconds: 60
          timeoutSeconds: 15
          periodSeconds: 5
        readinessProbe:
          httpGet:
            path: /
            port: main-port
          initialDelaySeconds: 60
          timeoutSeconds: 15
          periodSeconds: 5
        startupProbe:
          httpGet:
            path: /
            port: main-port
          initialDelaySeconds: 60
          timeoutSeconds: 15
          failureThreshold: 10
          periodSeconds: 10

        resources:
          requests:
            memory: "256Mi"
            cpu: "0.15"
          limits:
            memory: "512Mi"
            cpu: "1"
---
`
