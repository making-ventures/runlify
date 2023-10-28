import curlExampleToText from '../../../../../../documentation/curlExampleToText'
import { ProjectWideGenerationArgs } from '../../../../../args'
import { RestApi } from '../../../../../builders/buildedTypes'

export const backDocsRestApi = (
  { system }: ProjectWideGenerationArgs,
  restApi: RestApi
) => {
  const rootPath = `/rest/${restApi.path}`

  return `
# ${restApi.title[system.defaultLanguage].singular}
Корневой путь апи: \`${rootPath}\`

${restApi.methods
  .map((method) => {
    const getPath = (methodPath: string) =>
      `/rest/${restApi.path}/${methodPath}`
    const path = getPath(method.path)
    const pathExample = getPath(
      method.urlExample ? method.urlExample : method.path
    )

    return `## ${method.needFor[system.defaultLanguage]}
Путь: \`${path}\`

Метод: \`${method.httpMethod}\`${
      method.note
        ? `

${method.note}`
        : ''
    }${
      method.httpMethod === 'GET'
        ? ''
        : `

### Пример объекта запроса
\`\`\`
${JSON.stringify(method.requestExample, null, 2)}
\`\`\``
    }

### Пример curl запроса
\`\`\`
${curlExampleToText({
  baseUrl: 'https://DOMAIN',
  path: pathExample,
  method: method.httpMethod,
  auth: restApi.auth ? {
    type: 'headerToken',
    token: 'TOKEN',
  } : undefined,
  data: method.requestExample,
})}
\`\`\`

### Пример ответа в случае успеха
\`\`\`
${JSON.stringify(method.successResponseExample, null, 2)}
\`\`\`

### Пример ответа в случае ошибки
\`\`\`
${JSON.stringify(method.errorResponseExample, null, 2)}
\`\`\`
`
  })
  .join('\n')}`
}
