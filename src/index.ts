export { default as SystemMetaBuilder} from './projectsGeneration/builders/SystemMetaBuilder'
export * from './projectsGeneration'
export {Storage, type StorageType, type SearchEngine} from './projectsGeneration/builders/storage'
export {
  GenerationPathCategory,
  GenerationPathParam,
  resolveGenerationPath,
  type GenerationPathRoot,
  type GenerationPathTemplate,
  type GenerationPathVars,
  type GenerationPathDefinition,
  type GenerationPathsRegistry,
  type GenerationPathsConfig,
  type ResolveGenerationPathArgs,
} from './projectsGeneration/builders/generationPaths'
export {GenerationPathsBuilder} from './projectsGeneration/builders/GenerationPathsBuilder'
