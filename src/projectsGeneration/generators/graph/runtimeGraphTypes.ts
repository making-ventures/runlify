export interface RuntimeCrudService {
  get: (id: unknown, checkPermission: boolean) => unknown
  all: (params: unknown, checkPermission: boolean) => unknown
  meta: (params: unknown, checkPermission: boolean) => unknown
  create: (params: unknown, checkPermission: boolean) => unknown
  update: (params: unknown, checkPermission: boolean) => unknown
  delete: (params: unknown, checkPermission: boolean) => unknown
  rePost?: (id: unknown, checkPermission: boolean) => unknown
}

export interface RuntimeGraphContext {
  service: (name: string) => RuntimeCrudService
}

export type RuntimeGraphResolverFn = (
  parent: unknown,
  params: {id?: unknown},
  context: {context: RuntimeGraphContext}
) => unknown

export interface RuntimeGraphResolvers {
  Query: Record<string, RuntimeGraphResolverFn>
  Mutation: Record<string, RuntimeGraphResolverFn>
}
