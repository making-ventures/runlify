export interface ApiDocumentation {
  title: string
  requestExample: string
  successResponseExample: string
  errorResponseExample: string
}

export interface CurlExampleBearerAuth {
  type: 'bearer'
  token: string
}

export interface CurlExampleHeaderTokenAuth {
  type: 'headerToken'
  token: string
}

export type CurlExampleAuth = CurlExampleBearerAuth | CurlExampleHeaderTokenAuth

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'

export interface CurlExample {
  method: HttpMethod
  baseUrl: string
  path: string
  data?: Record<string, any>
  headers?: Record<string, string>
  auth?: CurlExampleAuth
}
