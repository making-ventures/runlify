/* eslint-disable max-len */
import { constantCase } from 'change-case'
import { ProjectWideGenerationArgs } from '../../../../args'
import { generatedWarning } from '../../../../utils'

export const gitlabCiTmpl = ({
  system: { prefix },
  system,
  options,
}: ProjectWideGenerationArgs) => `image: node:16
${
  options.skipWarningThisIsGenerated
    ? ''
    : `
# ${generatedWarning}
`
}
stages:
  - check
  - build
  - latest-image
  ${system.deployEnvironments.map((e) => `- deploy-${e.name}`).join(`
  `)}

cache:
  paths:
    - .cache
    - .cache_images
    # - node_modules

variables:
  REPO_NAME: $CI_PROJECT_NAME
  VERBOSE: 'true'
  RELEASE: $CI_COMMIT_SHORT_SHA
  KUBECONFIG: /etc/deploy/config
  PROJECT_NAME: ${system.name}

check:
  stage: check
  image: registry.gitlab.com/making.ventures/images/node-with-tools
  before_script:
    - yarn install --frozen-lockfile
  script:
    - ./check.sh
  variables:
    DATABASE_URI: $TEST_DATABASE_URI

build:
  stage: build
  image:
    name: gcr.io/kaniko-project/executor:debug
    entrypoint: ['']
  before_script:
    - mkdir -p /kaniko/.docker
    - echo "{\\"auths\\":{\\"$CI_REGISTRY\\":{\\"username\\":\\"$CI_REGISTRY_USER\\",\\"password\\":\\"$CI_REGISTRY_PASSWORD\\"}}}" > /kaniko/.docker/config.json
    # - /kaniko/warmer --cache-dir=$CI_PROJECT_DIR/.cache_images --image=browserless/chrome
  script:
    - /kaniko/executor
      --cache-dir=$CI_PROJECT_DIR/.cache_images
      --context \${CI_PROJECT_DIR}
      --dockerfile \${CI_PROJECT_DIR}/Dockerfile
      --destination \${CI_REGISTRY_IMAGE}:\${CI_COMMIT_REF_SLUG}
      --destination \${CI_REGISTRY_IMAGE}:\${CI_COMMIT_REF_SLUG}-\${CI_COMMIT_SHA}
      --single-snapshot
  only:
    - master
    - release
    - /^release-.*$/${system.deployEnvironments
      .filter(
        (e) => e.name !== 'prod' && e.name !== 'dev' && e.name !== 'stage'
      )
      .map((e) => `\n    - ${e.name}`)}

master-to-latest:
  extends: .tag-image
  stage: latest-image
  only:
    - master
  variables:
    TAG_ORIGIN: master
    TAG_DESTINATION: latest

.tag-image:
  image:
    name: gcr.io/go-containerregistry/crane:debug
    entrypoint: ['']
  script:
    - crane auth login -u $CI_REGISTRY_USER -p $CI_REGISTRY_PASSWORD $CI_REGISTRY
    - crane cp \${CI_REGISTRY_IMAGE}:\${TAG_ORIGIN} \${CI_REGISTRY_IMAGE}:\${TAG_DESTINATION}
  variables:
    GIT_STRATEGY: none

${system.deployEnvironments
  .map((e) =>
    `deploy-${e.name}-back:
  extends: .deploy-${
    e.name === 'prod' || e.name === 'demo' ? 'prod' : 'dev'
  }-back
  stage: deploy-${e.name}
  variables:
    ENV: "${e.name}"
    CLUSTER_NAME: "${e.clusterName}01"
${
  e.name !== 'prod' && e.name !== 'dev' && e.name !== 'stage'
    ? `    TAG: ":${e.name}"`
    : ''
}
${
  e.name !== 'prod' && e.name !== 'dev' && e.name !== 'stage'
    ? `  only:
    - ${e}`
    : ''
}`.replace(/\n\n/gu, '\n')
  )
  .join('\n')
  .trim()}${
  system.workers.length > 0
    ? '\n\n' +
      system.deployEnvironments
        .map((e) =>
          `deploy-${e.name}-workers:
  extends: .deploy-${
    e.name === 'prod' || e.name === 'demo' ? 'prod' : 'dev'
  }-workers
  stage: deploy-${e.name}
  variables:
    ENV: "${e.name}"
    CLUSTER_NAME: "workers-${e.clusterName}01"
${
  e.name !== 'prod' && e.name !== 'dev' && e.name !== 'stage'
    ? `    TAG: ":${e.name}"`
    : ''
}
${
  e.name !== 'prod' && e.name !== 'dev' && e.name !== 'stage'
    ? `  only:
    - ${e}`
    : ''
}`.replace(/\n\n/gu, '\n')
        )
        .join('\n')
        .trim()
    : ''
}

.deploy-dev-back:
  extends:
    - .deploy-dev
    - .deploy-back
  variables:
    KUBE_CONFIG: \${KUBE_STAGE01_CONFIG}
    BACK_ENABLED: "true"
    INGRESS_ENABLED: "true"
    METRICS_ENABLED: "true"
    WORKER_ENABLED: "false"
    BOT_ENABLED: "false"
    ROOT_ENABLED: "false"

.deploy-dev-workers:
  extends:
    - .deploy-dev
    - .deploy-worker
  variables:
    KUBE_CONFIG: \${KUBE_WORKERS01_CONFIG}
    BACK_ENABLED: "false"
    INGRESS_ENABLED: "false"
    METRICS_ENABLED: "false"
    WORKER_ENABLED: "true"
    BOT_ENABLED: "true"
    ROOT_ENABLED: "false"
  only:
    - master

.deploy-prod-back:
  extends:
    - .deploy-prod
    - .deploy-back
  variables:
    KUBE_CONFIG: \${KUBE_PROD01_CONFIG}
    BACK_ENABLED: "true"
    INGRESS_ENABLED: "true"
    METRICS_ENABLED: "true"
    WORKER_ENABLED: "false"
    BOT_ENABLED: "false"
    ROOT_ENABLED: "false"

.deploy-prod-workers:
  extends:
    - .deploy-prod
    - .deploy-worker
  variables:
    KUBE_CONFIG: \${KUBE_WORKERS01_CONFIG}
    BACK_ENABLED: "false"
    INGRESS_ENABLED: "false"
    METRICS_ENABLED: "false"
    WORKER_ENABLED: "true"
    BOT_ENABLED: "true"
    ROOT_ENABLED: "false"

.deploy-dev:
  extends: .deploy
  variables:
    ENV: "stage"
    DEV: "true"
    HOST: "making.ventures"
    ROOT_ENABLED: "false"
    TAG: ":latest"${system.configVars
      .filter((v) => v.scopes.includes('back'))
      .map(
        (v) => `\n    ${constantCase(v.name)}: \${DEV_${constantCase(v.name)}}`
      )
      .join('')}
    APP_ENVIRONMENT: dev
  only:
    - master

.deploy-prod:
  extends: .deploy
  stage: deploy-prod
  when: manual
  variables:
    ENV: "prod"
    DEV: "false"
    HOST: "making.ventures"
    ROOT_ENABLED: "true"
    TAG: ":release"${system.configVars
      .filter((v) => v.scopes.includes('back'))
      .map(
        (v) => `\n    ${constantCase(v.name)}: \${PROD_${constantCase(v.name)}}`
      )
      .join('')}
    APP_ENVIRONMENT: prod
  only:
    - release
    - /^release-.*$/

.deploy-back:
  variables:
    DEPLOY_KIND: "back"

.deploy-worker:
  variables:
    DEPLOY_KIND: "worker"

.deploy-telegramBot:
  variables:
    DEPLOY_KIND: "telegramBot"

.deploy:
  image:
    name: alpine/helm:3.9.0
    entrypoint: [""]
  before_script:
    - mkdir -p /etc/deploy
    - echo \${KUBE_CONFIG} | base64 -d > \${KUBECONFIG}
  script:
    - NAMESPACE=\${NAMESPACE:-"${options.k8sNamespacePrefix || prefix}-\${ENV}"}
    - echo NAMESPACE \${NAMESPACE}
    - echo chart \${NAMESPACE}-\${DEPLOY_KIND}

    - helm upgrade
      --install
      --wait \${NAMESPACE}-\${DEPLOY_KIND} chart
      --timeout 3600s
      -f chart/values_\${ENV}.yaml
      --set "global.projectName=\${PROJECT_NAME}"
      --set "global.clusterName=\${CLUSTER_NAME}"
      --set "global.env=\${ENV}"
      --set "global.deployKind=\${DEPLOY_KIND}"
      --set "random=:$(date)"
      --set "app.tag=\${TAG}"
      --set "ingress.host=\${HOST}"
      --set "style=\${STYLE}"
      --set "back.enabled=$\{BACK_ENABLED}"
      --set "ingress.enabled=\${INGRESS_ENABLED}"
      --set "metrics.enabled=\${METRICS_ENABLED}"
      --set "worker.enabled=\${WORKER_ENABLED}"
      --set "bot.enabled=\${BOT_ENABLED}"
      --set "ingress.rootEnabled=\${ROOT_ENABLED}"${system.configVars
        .filter((v) => v.scopes.includes('back'))
        .map((v) => `\n      --set "${v.name}=\${${constantCase(v.name)}}"`)
        .join('')}
      --namespace \${NAMESPACE}
`
