import { ProjectWideGenerationArgs } from '../../../../args'
import { generatedWarning } from '../../../../utils'

export const dockerfileTmplBack = ({
  options,
}: ProjectWideGenerationArgs) => `${options.skipWarningThisIsGenerated
    ? ''
    : `# ${generatedWarning}
`
}
FROM registry.gitlab.com/making.ventures/images/node-with-tools AS builder

# docker build --tag aloyal-back .
# docker run --rm -p 3000:3000 --name aloyal-back aloyal-back
# docker run --rm --name aloyal-back aloyal-back ls
# docker run --rm --name aloyal-back aloyal-back ls docs

RUN mkdir /app
WORKDIR /app
COPY yarn.lock package.json ./
RUN rm -rf /root/.cache/prisma/
RUN rm -fr node_modules && yarn install --frozen-lockfile
COPY . .

RUN npm run prisma:gen${options.sharding ? `
RUN npm run shards:gen` : ''}
RUN npm run build

# Actual image (this version of node required for email sending by email-templates, not booster)
FROM ${options.backendBaseDockerimage}

RUN mkdir -p /usr/src/app/back
WORKDIR /usr/src/app/back

USER node
COPY --chown=node:node --from=builder /app /usr/src/app/back

ENV PROD_PORT=3000
EXPOSE 3000

CMD ["node", "dist/index.js"]
`
