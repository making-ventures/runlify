/* eslint-disable max-len */
import { constantCase } from 'change-case'
import { ProjectWideGenerationArgs } from '../../../../args'
import { generatedWarning } from '../../../../utils'

export const uiGitlabCiTmpl = ({
  system: { prefix },
  system,
  options,
}: ProjectWideGenerationArgs) => `image: node:18
${
  options.skipWarningThisIsGenerated
    ? ''
    : `
# ${generatedWarning}
`
}
stages:
  - check
  - previous-image
  - build
  - latest-image
  - deploy
  - deploy-previous

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

tag-previous-with-sha:
  extends: .tag-image
  stage: previous-image
  only:${system.deployEnvironments
    .map((e) => `\n    - ${e.branchName}\n    - /^${e.branchName}-.*$/`).join('')}
  allow_failure: true # Firt run won't be able to create previous image
  variables:
    TAG_ORIGIN: :\${CI_COMMIT_REF_SLUG}
    TAG_DESTINATION: :\${CI_COMMIT_REF_SLUG}-previous-for-\${CI_COMMIT_SHA}

build:
  stage: build
  image:
    name: gcr.io/kaniko-project/executor:debug
    entrypoint: ['']
  before_script:
    - mkdir -p /kaniko/.docker
    - echo "{\\"auths\\":{\\"$CI_REGISTRY\\":{\\"username\\":\\"$CI_REGISTRY_USER\\",\\"password\\":\\"$CI_REGISTRY_PASSWORD\\"}}}" > /kaniko/.docker/config.json
    # - /kaniko/warmer --cache-dir=$CI_PROJECT_DIR/.cache_images --image=browserless/chrome
    - echo TAG1 "\${CI_COMMIT_REF_SLUG}"
    - echo TAG2 "\${CI_COMMIT_REF_SLUG}-\${CI_COMMIT_SHA}"
  script:
    - /kaniko/executor
      --cache-dir=$CI_PROJECT_DIR/.cache_images
      --context \${CI_PROJECT_DIR}
      --dockerfile \${CI_PROJECT_DIR}/Dockerfile
      --destination \${CI_REGISTRY_IMAGE}:\${CI_COMMIT_REF_SLUG}
      --destination \${CI_REGISTRY_IMAGE}:\${CI_COMMIT_REF_SLUG}-\${CI_COMMIT_SHA}
      --single-snapshot
  only:${system.deployEnvironments
    .map((e) => `\n    - ${e.branchName}\n    - /^${e.branchName}-.*$/`).join('')}

tag-latest:
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
    - echo TAG_DESTINATION \${TAG_DESTINATION}
    - crane auth login -u $CI_REGISTRY_USER -p $CI_REGISTRY_PASSWORD $CI_REGISTRY
    - crane cp \${CI_REGISTRY_IMAGE}:\${TAG_ORIGIN} \${CI_REGISTRY_IMAGE}:\${TAG_DESTINATION}
  variables:
    GIT_STRATEGY: none

${system.deployEnvironments
  .map((e) =>
    `deploy-${e.name}:
  extends: .deploy-${e.name}
  stage: deploy
  variables:
    ENV: "${e.name}"
    CLUSTER_NAME: "${e.clusterName}"
    TAG: ":\${CI_COMMIT_REF_SLUG}-\${CI_COMMIT_SHA}"
  only:
    - ${e.branchName}
    - /^${e.branchName}-.*$/`).join('\n\n')}

${system.deployEnvironments
  .map((e) =>
    `deploy-${e.name}-previous:
  extends: .deploy-${e.name}
  stage: deploy-previous
  when: manual
  variables:
    ENV: "${e.name}"
    CLUSTER_NAME: "${e.clusterName}"
    TAG: ":\${CI_COMMIT_REF_SLUG}-previous-for-\${CI_COMMIT_SHA}"
  only:
    - ${e.branchName}
    - /^${e.branchName}-.*$/`).join('\n\n')}

${system.deployEnvironments
  .map((e) =>`.deploy-${e.name}:
  extends: .deploy-ui
  stage: deploy
  when: ${e.manualDeploy ? 'manual' : 'on_success'}
  only:
    - ${e.branchName}
    - /^${e.branchName}-.*$/
  tags:
    - ${e.runnerTag}
  variables:
    ENV: "${e.name}"
    DEV: "false"
    HOST: "${e.host}"
    ROOT_ENABLED: "${e.main}"
    KUBE_CONFIG: \${KUBE_${e.clusterName.toUpperCase()}_CONFIG}
    TAG: ":\${CI_COMMIT_REF_SLUG}-\${CI_COMMIT_SHA}"${system.configVars
      .filter((v) => v.scopes.includes('admin-app') || v.scopes.includes('ci'))
      .map(
        (v) => `\n    ${constantCase(v.name)}: \${${e.gitlabEnvPrefix.toUpperCase()}_${constantCase(v.name)}}`
      )
      .join('')}`).join('\n\n')}

.deploy-ui:
  extends: .deploy
  variables:
    DEPLOY_KIND: "ui"

.deploy:
  image:
    name: alpine/helm:3.9.0
    entrypoint: [""]
  before_script:
    - mkdir -p /etc/deploy
    - echo \${KUBE_CONFIG} | base64 -d > \${KUBECONFIG}
  script:
    - NAMESPACE=\${NAMESPACE:-"${options.k8sNamespacePrefix || prefix}-\${ENV}"}
    - echo TAG \${TAG}
    - echo NAMESPACE \${NAMESPACE}
    - echo chart \${NAMESPACE}-\${DEPLOY_KIND}

    - helm upgrade
      --install
      --wait \${NAMESPACE}-\${DEPLOY_KIND} chart
      --timeout 3600s
      -f chart/values_\${ENV}.yaml
      --namespace \${NAMESPACE}
      --create-namespace
      --set "global.projectName=\${PROJECT_NAME}"
      --set "global.clusterName=\${CLUSTER_NAME}"
      --set "global.env=\${ENV}"
      --set "global.deployKind=\${DEPLOY_KIND}"
      --set "random=:$(date)"
      --set "app.tag=\${TAG}"
      --set "ingress.host=\${HOST}"
      --set "style=\${STYLE}"
      --set "ingress.rootEnabled=\${ROOT_ENABLED}"${system.configVars
        .filter((v) => v.scopes.includes('admin-app') || v.scopes.includes('ci'))
        .map((v) => `\n      --set "${v.name}=\${${constantCase(v.name)}}"`)
        .join('')}
`
