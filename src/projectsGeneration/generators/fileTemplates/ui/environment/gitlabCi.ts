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
  only:
    - master
    - release
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
    - release${system.deployEnvironments
      .filter(
        (e) => e.name !== 'prod' && e.name !== 'dev' && e.name !== 'stage'
      )
      .map((e) => `\n    - ${e.name}`)}

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
    - crane auth login -u $CI_REGISTRY_USER -p $CI_REGISTRY_PASSWORD $CI_REGISTRY
    - crane cp \${CI_REGISTRY_IMAGE}:\${TAG_ORIGIN} \${CI_REGISTRY_IMAGE}:\${TAG_DESTINATION}
  variables:
    GIT_STRATEGY: none

${system.deployEnvironments
  .map((e) =>
    `deploy-${e.name}:
  extends: .deploy-${e.name === 'prod' || e.name === 'demo' ? 'prod' : 'dev'}
  stage: deploy
  variables:
    ENV: "${e.name}"
    CLUSTER_NAME: "${e.clusterName}"
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
  .join('\n')}
${system.deployEnvironments
  .map((e) =>
    `deploy-${e.name}-previous:
  extends: .deploy-${e.name === 'prod' || e.name === 'demo' ? 'prod' : 'dev'}
  stage: deploy-previous
  when: manual
  variables:
    ENV: "${e.name}"
    CLUSTER_NAME: "${e.clusterName}"
    TAG: ":\${CI_COMMIT_REF_SLUG}-previous-for-\${CI_COMMIT_SHA}"
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
  .join('\n')}

.deploy-prod:
  extends:
    - .deploy
    - .deploy-ui
  stage: deploy
  when: manual
  variables:
    ENV: "prod"
    DEV: "false"
    HOST: "making.ventures"
    ROOT_ENABLED: "true"
    TAG: ":\${CI_COMMIT_REF_SLUG}-\${CI_COMMIT_SHA}"
    KUBE_CONFIG: \${KUBE_PROD01_CONFIG}${system.configVars
      .filter((v) => v.scopes.includes('admin-app') || v.scopes.includes('ci'))
      .map(
        (v) => `\n    ${constantCase(v.name)}: \${PROD_${constantCase(v.name)}}`
      )
      .join('')}
  only:
    - release

.deploy-ui:
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
      --set "ingress.rootEnabled=\${ROOT_ENABLED}"${system.configVars
        .filter((v) => v.scopes.includes('admin-app') || v.scopes.includes('ci'))
        .map((v) => `\n      --set "${v.name}=\${${constantCase(v.name)}}"`)
        .join('')}
      --namespace \${NAMESPACE}
`
