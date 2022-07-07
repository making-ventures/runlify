import { RestApiMethod } from './buildedTypes'
import BaseBuilder from './BaseBuilder'
import { HttpMethod } from './curlTypes'

class RestApiMethodBuilder extends BaseBuilder {
  httpMethod: HttpMethod
  note = ''
  path: string
  urlExample?: string
  requestExample: Record<string, any> = {}
  successResponseExample: Record<string, any> = {}
  errorResponseExample: Record<string, any> = {}

  constructor(
    name: string,
    path: string,
    httpMethod: HttpMethod,
    defaultLanguage: string,
    title?: string
  ) {
    super(name, defaultLanguage, title)
    this.path = path
    this.httpMethod = httpMethod
  }

  setNote(note: string) {
    this.note = note

    return this
  }

  setRequestExample(requestExample: Record<string, any>) {
    this.requestExample = requestExample

    return this
  }

  setUrlExample(urlExample: string) {
    this.urlExample = urlExample

    return this
  }

  setSuccessResponseExample(successResponseExample: Record<string, any>) {
    this.successResponseExample = successResponseExample

    return this
  }

  setErrorResponseExample(errorResponseExample: Record<string, any>) {
    this.errorResponseExample = errorResponseExample

    return this
  }

  build(): RestApiMethod {
    return {
      type: 'restApiMethod',
      name: this.name,
      title: this.title,
      needFor: this.needFor,
      materialUiIcon: this.materialUiIcon,
      path: this.path,
      note: this.note,
      httpMethod: this.httpMethod,
      requestExample: this.requestExample,
      successResponseExample: this.successResponseExample,
      errorResponseExample: this.errorResponseExample,
      urlExample: this.urlExample,
    }
  }
}

export default RestApiMethodBuilder
