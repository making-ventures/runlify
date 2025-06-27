import {join} from 'path'
import { pascal } from '../utils/cases'
import {printSchema} from 'graphql'
import {AdditionalServiceWideGenerationArgs} from './args'
import {backAdditionalServiceResolversTmpl} from './generators/fileTemplates/back/graph/additionalService/resolvers'
import {backAdditionalServiceTypeDefsTmpl} from './generators/fileTemplates/back/graph/additionalService/typeDefs'
import { backAdditionalServicePermissionToGraphqlTmpl } from './generators/fileTemplates/back/graph/additionalService/permissionToGraphql'
import { genGraphAdditionalServiceSchema } from './generators/graph/genGraphAdditionalServiceSchema'
import { backAdditionalServiceTypesTmpl } from './generators/fileTemplates/back/services/additionalService/types'
import { createFilesToWriteUtils } from './utils'

export const generateAdditionalService = async (
  serviceWideGenerationArgs: AdditionalServiceWideGenerationArgs
) => {
  const {
    filesToWrite,
    write
  } = createFilesToWriteUtils();

  const {
    service,
    options,
  } = serviceWideGenerationArgs
  let prjBackSrcPrefixedDir = ''
  const prjDetachedBackSrcDir = join(options.detachedBackProject, 'src')

  prjBackSrcPrefixedDir = join(prjDetachedBackSrcDir, 'adm')

  const serviceName = `${pascal(service.name)}Service`
  const serviceDir = join(prjBackSrcPrefixedDir, 'services', serviceName)

  await write(
    join(serviceDir, 'types.ts'),
    backAdditionalServiceTypesTmpl(serviceWideGenerationArgs)
  )

  // Graph
  const graphServiceDir = join(
    prjBackSrcPrefixedDir,
    'graph',
    'services',
    service.name,
  )

  // Graph schema
  if (options.genGraphSchema) {
    await write(
      join(graphServiceDir, 'typeDefs.ts'),
      backAdditionalServiceTypeDefsTmpl(printSchema(genGraphAdditionalServiceSchema(service)), options)
    )
  }

  // Graph resolvers
  if (options.genGraphResolvers && !options.typesOnly) {
    await write(
      `${graphServiceDir}/resolvers.ts`,
      backAdditionalServiceResolversTmpl(serviceWideGenerationArgs)
    )
  }

  if (!options.typesOnly) {
    // Permissions
    await write(
      `${graphServiceDir}/permissionsToGraphql.ts`,
      backAdditionalServicePermissionToGraphqlTmpl(serviceWideGenerationArgs)
    )
  }

  return filesToWrite;
}
