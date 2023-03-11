import { paramCase } from 'change-case'
import { ProjectWideGenerationArgs } from '../../../../../args'
import { generatedWarning } from '../../../../../utils'

export const chartValuesTmpl = ({
  system: { prefix },
  system,
  options,
}: ProjectWideGenerationArgs) => `${
  options.skipWarningThisIsGenerated
    ? ''
    : `
# ${generatedWarning}
`
}
global:
  env: noName
  clusterName: noName
  deployKind: noName
  imagePullPolicy: Always

dev: false

docker:
  registry: ${options.ciDockerRegistry}

app:
  tag: :master
  replicas: 1

image:
  repository: nginx
  tag: stable
  pullPolicy: IfNotPresent

imagePullSecrets:
  - name: ${options.k8sImagePullSecrets}

nameOverride: ""
fullnameOverride: ""

service:
  type: ClusterIP
  port: "80"

deployment:
  annotations:
    prometheus.io/path: '/metrics'
    prometheus.io/scrape: true
    prometheus.io/port: 2100

back:
  enabled: true
  replicas: ${system.back.replicas}
  requests:
    memory: "${system.back.requests.memory}"
    cpu: "${system.back.requests.cpu}"
  limits:
    memory: "${system.back.limits.memory}"
    cpu: "${system.back.limits.cpu}"

metrics:
  enabled: true

worker:
  enabled: false
  replicas: 1
  requests:
    memory: "64Mi"
    cpu: "0.15"
  limits:
    memory: "64Mi"
    cpu: "0.15"

workers:${system.workers
  .map(
    (worker) => `\n  - name: ${paramCase(worker.name)}
    file: dist/workers/${worker.name}/${worker.name}Worker.js
    requests:
      memory: "${worker.requests.memory}"
      cpu: "${worker.requests.cpu}"
    limits:
      memory: "${worker.limits.memory}"
      cpu: "${worker.limits.cpu}"`
  )
  .join('')}

bot:
  enabled: false
  replicas: 1
  requests:
    memory: "128Mi"
    cpu: "0.5"
  limits:
    memory: "256Mi"
    cpu: "1"

bots:${system.telegramBots
  .map(
    ({ name }) => `\n  - name: ${name}
    file: dist/bots/${name}Bot.js`
  )
  .join('')}

apollo:
  key: ''

database:
  uri: ''

ingress:
  enabled: true
  annotations:
    nginx.ingress.kubernetes.io/limit-connections: "100"
    nginx.ingress.kubernetes.io/limit-rps: "300"
    nginx.ingress.kubernetes.io/limit-rpm: "5000"
    nginx.ingress.kubernetes.io/affinity: "cookie"
    nginx.ingress.kubernetes.io/proxy-body-size: "50m"
  host: "${options.k8sAppsDomain}"
  letsencryptCert: true
  domain: "${options.k8sSubdomainPrefix || prefix}-ep"

resources:
  {}
  # We usually recommend not to specify default resources and to leave this as a conscious
  # choice for the user. This also increases chances charts run on environments with little
  # resources, such as Minikube. If you do want to specify resources, uncomment the following
  # lines, adjust them as necessary, and remove the curly braces after 'resources:'.
  # limits:
  #   cpu: 100m
  #   memory: 128Mi
  # requests:
  #   cpu: 100m
  #   memory: 128Mi

nodeSelector: {}

tolerations: []

affinity: {}
`
