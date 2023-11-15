import {join} from 'path'
import {
  // pascalPlural,
} from '../utils/cases'
// import {backBaseTypesTmpl} from './generators/fileTemplates/back/graph/types'
// import {backBaseResolversTmpl} from './generators/fileTemplates/back/graph/resolvers'
import {printSchema} from 'graphql'
// import {writeFileIfNotExists} from './utils'
import {write} from 'fs-jetpack'
// import {backAdditionalResolversTmpl} from './generators/fileTemplates/back/graph/additionalResolvers'
// import {backAdditionalServicePermissionToGraphqlTmpl} from './generators/fileTemplates/back/graph/servicePermissionToGraphqlTmpl'
// import {backAdditionalServiceAdditionalPermissionToGraphqlTmpl} from './generators/fileTemplates/back/graph/serviceAdditionalPermissionToGraphqlTmpl'
// import {backBasePermissionToGraphqlTmpl} from './generators/fileTemplates/back/graph/serviceBasePermissionToGraphql'
// import {backAdditionalTypesTmpl} from './generators/fileTemplates/back/graph/additionalTypes'
import {AdditionalServiceWideGenerationArgs} from './args'
import {backAdditionalServiceResolversTmpl} from './generators/fileTemplates/back/graph/additionalService/resolvers'
import {backAdditionalServiceTypesTmpl} from './generators/fileTemplates/back/graph/additionalService/typeDefs'
import { backAdditionalServicePermissionToGraphqlTmpl } from './generators/fileTemplates/back/graph/additionalService/permissionToGraphql'
import { genGraphAdditionalServiceSchema } from './generators/graph/genGraphAdditionalServiceSchema'
// import {prismaServiceBaseClassTmpl} from './generators/fileTemplates/back/services/service/class'
// import {prismaAdditionalServiceClassTmpl} from './generators/fileTemplates/back/services/service/additionalClass'

export const generateAdditionalService = async (
  serviceWideGenerationArgs: AdditionalServiceWideGenerationArgs
) => {
  const {
    service,
    options,
  } = serviceWideGenerationArgs
  let prjBackSrcPrefixedDir = ''
  const prjDetachedBackSrcDir = join(options.detachedBackProject, 'src')

  prjBackSrcPrefixedDir = join(prjDetachedBackSrcDir, 'adm')

  // if (options.genPrismaServices && !options.typesOnly) {
  //   const serviceName = `${pascalPlural(service.name)}Service`
  //   const serviceDir = join(prjBackSrcPrefixedDir, 'services', serviceName)
  //   const servicePath = join(serviceDir, `${serviceName}.ts`)
  //   const additionalServicePath = join(serviceDir, `Additional${serviceName}.ts`)

  //   const additionalClassService = prismaAdditionalServiceClassTmpl(serviceWideGenerationArgs)
  //   await writeFileIfNotExists(additionalServicePath, additionalClassService)

  //   const generatedClassService = prismaServiceBaseClassTmpl(serviceWideGenerationArgs)
  //   await write(servicePath, generatedClassService)
  // }

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
      backAdditionalServiceTypesTmpl(printSchema(genGraphAdditionalServiceSchema(service)), options)
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
}
