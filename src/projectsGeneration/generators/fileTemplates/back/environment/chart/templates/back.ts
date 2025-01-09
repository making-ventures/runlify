import { constantCase } from 'change-case'
import { ProjectWideGenerationArgs } from '../../../../../../args'
import { generatedWarning } from '../../../../../../utils'

export const chartBackTmpl = ({
  system: { prefix },
  system,
  options,
}: ProjectWideGenerationArgs) => `${
  options.skipWarningThisIsGenerated
    ? ''
    : `
# ${generatedWarning}

{{- if .Values.back.enabled }}
`
}apiVersion: v1
kind: Service
metadata:
  name: {{ $.Values.global.projectName }}-{{ $.Values.global.deployKind }}
  labels:
    app: {{ $.Values.global.projectName }}-{{ $.Values.global.deployKind }}
    projectName: {{ $.Values.global.projectName }}
    clusterName: {{ $.Values.global.clusterName }}
    env: {{ $.Values.global.env }}
    deployKind: {{ $.Values.global.deployKind }}
    prometheus: enable
spec:
  ports:
  - name: http
    port: 3000
    protocol: TCP
    targetPort: 3000
  selector:
    app: {{ $.Values.global.projectName }}-{{ $.Values.global.deployKind }}
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: {{ $.Values.global.projectName }}-{{ $.Values.global.deployKind }}
spec:
  replicas: {{ $.Values.back.replicas }}
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: 3
  selector:
    matchLabels:
      app: {{ $.Values.global.projectName }}-{{ $.Values.global.deployKind }}
  template:
    metadata:
      labels:
        app: {{ $.Values.global.projectName }}-{{ $.Values.global.deployKind }}
        projectName: {{ $.Values.global.projectName }}
        clusterName: {{ $.Values.global.clusterName }}
        env: {{ $.Values.global.env }}
        deployKind: {{ $.Values.global.deployKind }}
    spec:
      imagePullSecrets:
        - name: {{ $.Release.Name }}-pullsecret
      volumes:
      - name: cache-volume
        emptyDir: {}
      containers:
      - name: {{ $.Values.global.projectName }}-{{ $.Values.global.deployKind }}
        image: {{ $.Values.dockerRegistry.domain }}/{{ $.Values.global.projectGroup }}/{{ $.Values.global.projectName }}-{{ $.Values.global.deployKind }}{{ $.Values.app.tag }}
        volumeMounts:
        - mountPath: /cache
          name: cache-volume
        ports:
        - name: main-port
          containerPort: 3000
        imagePullPolicy: Always
        livenessProbe:
          httpGet:
            path: /health?type=liveness
            port: main-port
          initialDelaySeconds: 60
          timeoutSeconds: 15
          periodSeconds: 5
        readinessProbe:
          httpGet:
            path: /health?type=readiness
            port: main-port
          initialDelaySeconds: 60
          timeoutSeconds: 15
          periodSeconds: 5
        startupProbe:
          httpGet:
            path: /health?type=startup
            port: main-port
          initialDelaySeconds: 60
          timeoutSeconds: 15
          failureThreshold: 10
          periodSeconds: 10
        resources:
          requests:
            memory: {{ $.Values.back.requests.memory }}
            cpu: {{ $.Values.back.requests.cpu }}
          limits:
            memory: {{ $.Values.back.limits.memory }}
            cpu: {{ $.Values.back.limits.cpu }}
        securityContext:
          runAsNonRoot: true
          # readOnlyRootFilesystem: true
          runAsUser: 1000
        env:
        - name: NODE_ENV
          value: production
        - name: RANDOM
          value: {{ $.Values.random | quote }}
        - name: ENV
          value: '{{ $.Values.global.env }}'
        - name: APOLLO_KEY
          value: {{ $.Values.apollo.key | quote }}${system.configVars
            .filter((v) => v.scopes.includes('back'))
            .map(
              (v) => `\n        - name: ${constantCase(v.name)}
          value: {{ $.Values.${v.name} | quote }}`
            )
            .join('')}

        - name: K8S_NODE_NAME
          valueFrom:
            fieldRef:
              fieldPath: spec.nodeName
        - name: K8S_POD_NAME
          valueFrom:
            fieldRef:
              fieldPath: metadata.name
        - name: K8S_POD_NAMESPACE
          valueFrom:
            fieldRef:
              fieldPath: metadata.namespace
---
{{- end }}
`
