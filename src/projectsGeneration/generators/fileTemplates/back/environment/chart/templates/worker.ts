import { constantCase } from 'change-case'
import { ProjectWideGenerationArgs } from '../../../../../../args'
import { generatedWarning } from '../../../../../../utils'

export const chartWorkerTmpl = ({
  system: { prefix },
  system,
  options,
}: ProjectWideGenerationArgs) => `${
  options.skipWarningThisIsGenerated
    ? ''
    : `
# ${generatedWarning}

{{- if .Values.worker.enabled }}
`
}
{{- range $.Values.workers }}
apiVersion: v1
kind: Service
metadata:
  name: ${(options.k8sChartName || prefix).split('-')[0]}-{{ .name  }}-worker
  labels:
    app: ${(options.k8sChartName || prefix).split('-')[0]}-{{ .name  }}-worker
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
    app: ${(options.k8sChartName || prefix).split('-')[0]}-{{ .name  }}-worker
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: ${(options.k8sChartName || prefix).split('-')[0]}-{{ .name  }}-worker
spec:
  replicas: {{ $.Values.worker.replicas }}
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: 3
  selector:
    matchLabels:
      app: ${(options.k8sChartName || prefix).split('-')[0]}-{{ .name  }}-worker
  template:
    metadata:
      labels:
        app: ${(options.k8sChartName || prefix).split('-')[0]}-{{ .name  }}-worker
        projectName: {{ $.Values.global.projectName }}
        clusterName: {{ $.Values.global.clusterName }}
        env: {{ $.Values.global.env }}
        deployKind: {{ $.Values.global.deployKind }}
    spec:
      imagePullSecrets:
        - name: {{ $.Release.Name }}-pullsecret
      containers:
      - name: ${(options.k8sChartName || prefix).split('-')[0]}-{{ .name  }}-worker
        image: {{ $.Values.dockerRegistry.domain }}/${options.projectsGroup}/${
          options.projectPrefix || prefix
        }-worker{{ $.Values.app.tag }}
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
            memory: {{ $.Values.worker.requests.memory }}
            cpu: {{ $.Values.worker.requests.cpu }}
          limits:
            memory: {{ $.Values.worker.limits.memory }}
            cpu: {{ $.Values.worker.limits.cpu }}
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
            .filter((v) => v.scopes.includes('worker'))
            .map(
              (v) => `\n        - name: ${constantCase(v.name)}
          value: {{ $.Values.${v.name} | quote }}`
            )
            .join('')}

        - name: APP_URI
          value: {{ $.Values.app.prefix }}.{{ $.Values.ingress.host }}

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
{{- end }}
`
