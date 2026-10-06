import {existsSync, unlinkSync} from 'fs'
import {camelPlural} from '../../../../utils/cases'
import {ProjectWideGenerationArgs} from '../../../args'
import {
  GenerationPathCategory,
  resolveGenerationPath,
} from '../../../builders/generationPaths'

// Files generateBackEntityGraph always wrote in 'files' mode and skips
// entirely in 'runtime_meta' mode — stale leftovers from a switch would
// otherwise still be picked up by the typeDefs/resolvers glob loaders.
const STALE_RUNTIME_META_GRAPH_CATEGORIES = [
  GenerationPathCategory.BackGraphEntityBaseTypeDefs,
  GenerationPathCategory.BackGraphEntityBaseResolvers,
  GenerationPathCategory.BackGraphEntityBasePermissionsToGraphql,
  GenerationPathCategory.BackGraphEntityPermissionsToGraphql,
  GenerationPathCategory.BackGraphEntityAdditionalPermissionsToGraphql,
]

export default (
  entityWideGenerationArgs: ProjectWideGenerationArgs,
) => {
  if (entityWideGenerationArgs.options.graphSchemaMode !== 'runtime_meta') {
    return
  }

  entityWideGenerationArgs.entities.forEach((entity) => {
    STALE_RUNTIME_META_GRAPH_CATEGORIES.forEach((category) => {
      const filePath = resolveGenerationPath({
        category,
        detachedBackProject: entityWideGenerationArgs.options.detachedBackProject,
        detachedUiProject: entityWideGenerationArgs.options.detachedUiProject,
        pathsConfig: entityWideGenerationArgs.system.generationPaths,
        vars: {camelPlural: camelPlural(entity.name)},
      })

      if (existsSync(filePath)) {
        unlinkSync(filePath)
      }
    })
  })
}
