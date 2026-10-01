export * from './commonEntities'
export * from './types'
export * from './defaultCatalogs'
export * from './modules'
export * from './builders'
export * from './builders'
export * from './resolveProjectPaths'
export {default as getProjectSpec} from './generators/fileTemplates/back/environment/docs/spec/getProjectSpec'
export {default as generateProject} from './generateProject/generateProject'

// Runtime graph schema mode (graphSchemaMode: 'runtime_meta') — pure functions
// a consuming project's own server process can call directly, instead of the
// 'files' mode printing their output to per-entity disk files at regen time.
export {genGraphCrudSchema} from './generators/graph/genGraphCrudSchema'
export {genGraphCrudResolvers} from './generators/graph/genGraphCrudResolvers'
export {
  genGraphCrudPermissions,
  type GraphCrudPermissionToGraphql,
} from './generators/graph/genGraphCrudPermissions'
export type {
  RuntimeCrudService,
  RuntimeGraphContext,
  RuntimeGraphResolverFn,
  RuntimeGraphResolvers,
} from './generators/graph/runtimeGraphTypes'
