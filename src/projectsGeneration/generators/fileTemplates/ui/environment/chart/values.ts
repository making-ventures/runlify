import { ProjectWideGenerationArgs } from '../../../../../args'
import {printWarningIfRequired} from '../../../../../utils'

export const uiChartValuesTmpl = ({
  system: { prefix },
  options,
}: ProjectWideGenerationArgs) => `${printWarningIfRequired(options, 'hash')}
global:
  env: noName
  clusterName: noName
  projectName: ${options.k8sChartName || prefix}
  projectGroup: ${options.projectsGroup}
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

ingress:
  annotations:
    nginx.ingress.kubernetes.io/limit-connections: "100"
    nginx.ingress.kubernetes.io/limit-rps: "300"
    nginx.ingress.kubernetes.io/limit-rpm: "5000"
    nginx.ingress.kubernetes.io/affinity: "cookie"
    nginx.ingress.kubernetes.io/proxy-body-size: "${options.ingressAnnotationBodySize}"
    nginx.ingress.kubernetes.io/proxy-read-timeout: "7200"
    nginx.ingress.kubernetes.io/proxy-send-timeout: "7200"
  host: "${options.k8sAppsDomain}"
  letsencryptCert: true
  domains:
    app: "${options.k8sSubdomainPrefix || prefix}"
    endpoint: "${options.k8sSubdomainPrefix || prefix}-ep"

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
