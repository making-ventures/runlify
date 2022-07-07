import * as R from 'ramda'
import { CurlExample } from '../projectsGeneration/builders/curlTypes'

const prepareCurlExample = (curl: CurlExample) => {
  if (!curl.headers) {
    curl.headers = {}
  }

  if (curl.data) {
    curl.headers['Content-Type'] = 'application/json'
  }

  if (curl.auth) {
    curl.headers.authorization = curl.auth.token
  }
}

const curlExampleToText = (curl: CurlExample) => {
  prepareCurlExample(curl)

  // log.info(curl);

  const parts: string[] = []

  if (curl.method !== 'GET') {
    parts.push(`-i -X ${curl.method}`)
  }

  if (curl.headers) {
    for (const [key, value] of R.toPairs(curl.headers)) {
      parts.push(`--header "${key}: ${value}"`)
    }
  }

  if (curl.method !== 'GET' && curl.data) {
    const stringified = JSON.stringify(curl.data, null, 2)
    parts.push(`--data '${stringified}'`)
  }

  parts.push(`${curl.baseUrl}${curl.path}`)

  return `curl ${parts.join(' \\\n').split('\n').join('\n  ')}`
}

export default curlExampleToText
