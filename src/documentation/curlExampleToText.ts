import * as R from 'ramda'
import qs from 'qs';
import {CurlExample} from '../projectsGeneration/builders/curlTypes'

const prepareCurlExample = (curl: CurlExample) => {
  if (!curl.headers) {
    curl.headers = {}
  }

  if (curl.data && Object.keys(curl.data).length && curl.method !== 'GET') {
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

  let uri = `${curl.baseUrl}${curl.path}`

  if (curl.method !== 'GET') {
    parts.push(`-i -X ${curl.method}`)
  }

  if (curl.headers) {
    for (const [key, value] of R.toPairs(curl.headers)) {
      parts.push(`--header "${key}: ${value}"`)
    }
  }

  if (curl.data && Object.keys(curl.data).length) {
    if (curl.method === 'GET') {
      uri = `${uri}?${qs.stringify(curl.data)}`
    } else {
      const stringified = JSON.stringify(curl.data, null, 2)
      parts.push(`--data '${stringified}'`)
    }
  }

  parts.push(`'${uri}'`)

  return `curl ${parts.join(' \\\n').split('\n').join('\n  ')}`
}

export default curlExampleToText
