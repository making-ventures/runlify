import { RestApi } from './buildedTypes'
import BaseBuilder from './BaseBuilder'
import RestApiMethodBuilder from './RestApiMethodBuilder'
import { HttpMethod } from './curlTypes'

class RestApiBuilder extends BaseBuilder {
  methods: RestApiMethodBuilder[] = []
  path: string

  constructor(
    name: string,
    path: string,
    defaultLanguage: string,
    title?: string
  ) {
    super(name, defaultLanguage, {singular: title, plural: title})
    this.path = path
  }

  addMethod(
    name: string,
    path: string,
    httpMethod: HttpMethod,
    title?: string
  ) {
    if (this.methods.some((m) => m.path === path)) {
      throw new Error(`There is already method with path "${path}"`)
    }

    if (this.methods.some((m) => m.name === name)) {
      throw new Error(`There is already method with name "${name}"`)
    }

    const method = new RestApiMethodBuilder(
      name,
      path,
      httpMethod,
      this.defaultLanguage,
      title
    )

    this.methods.push(method)

    return method
  }

  build(): RestApi {
    return {
      ...super.build(),
      type: 'restApi',
      name: this.name,
      title: this.title,
      needFor: this.needFor,
      materialUiIcon: this.materialUiIcon,
      methods: this.methods.map((m) => m.build()),
      path: this.path,
    }
  }
}

export default RestApiBuilder
