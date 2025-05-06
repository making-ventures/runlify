import { constantCase } from 'change-case'
import { ProjectWideGenerationArgs } from '../../../../../../args'
import { generatedWarning } from '../../../../../../utils'

export const uiChartFrontTmpl = ({
  system,
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
  name: {{ $.Values.global.projectName }}-{{ $.Values.global.deployKind }}
  labels:
    app: {{ $.Values.global.projectName }}-{{ $.Values.global.deployKind }}
    projectName: {{ $.Values.global.projectName }}
    clusterName: {{ $.Values.global.clusterName }}
    env: {{ $.Values.global.env }}
    deployKind: {{ $.Values.global.deployKind }}
spec:
  ports:
  - name: http
    port: 80
    protocol: TCP
    targetPort: 80
  selector:
    app: {{ $.Values.global.projectName }}-{{ $.Values.global.deployKind }}
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: {{ $.Values.global.projectName }}-{{ $.Values.global.deployKind }}
spec:
  replicas: {{ $.Values.app.replicas }}
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
          containerPort: 80
        imagePullPolicy: Always
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
        env:
        - name: NODE_ENV
          value: production
        - name: RANDOM
          value: {{ $.Values.random | quote }}
        - name: ENV
          value: '{{ $.Values.global.env }}'${system.configVars
            .filter((v) => v.scopes.includes('admin-app'))
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
`
