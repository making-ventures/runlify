import {pascal} from '../../../../../utils/cases'
import {printSchema} from 'graphql'
import {AdditionalServiceWideGenerationArgs} from '../../../../args'
import {backAdditionalServiceResolversTmpl} from '../../../../generators/fileTemplates/back/graph/additionalService/resolvers'
import {backAdditionalServiceTypeDefsTmpl} from '../../../../generators/fileTemplates/back/graph/additionalService/typeDefs'
import {backAdditionalServicePermissionToGraphqlTmpl} from '../../../../generators/fileTemplates/back/graph/additionalService/permissionToGraphql'
import {genGraphAdditionalServiceSchema} from '../../../../generators/graph/genGraphAdditionalServiceSchema'
import {backAdditionalServiceTypesTmpl} from '../../../../generators/fileTemplates/back/services/additionalService/types'
import {FileCreator} from '../../../types'
import {addWarnings} from '../../../fileHandlers'
import {
  GenerationPathCategory,
  GenerationPathVars,
  resolveGenerationPath,
} from '../../../../builders/generationPaths'

const resolveBackPath = (
  args: AdditionalServiceWideGenerationArgs,
  category: GenerationPathCategory,
  vars: GenerationPathVars = {},
) =>
  resolveGenerationPath({
    category,
    detachedBackProject: args.options.detachedBackProject,
    detachedUiProject: args.options.detachedUiProject,
    pathsConfig: args.system.generationPaths,
    vars,
  })

const generateBackAdditionalService = (
  fileCreator: FileCreator,
  args: AdditionalServiceWideGenerationArgs,
) => {
  const {service, options} = args;
  const serviceName = `${pascal(service.name)}Service`;

  fileCreator.create(
    resolveBackPath(args, GenerationPathCategory.BackAdditionalServiceTypes, {
      ServiceName: serviceName,
    }),
    backAdditionalServiceTypesTmpl(args),
    addWarnings({options: args.options})
  );

  // Graph schema
  if (options.genGraphSchema) {
    fileCreator.create(
      resolveBackPath(args, GenerationPathCategory.BackAdditionalServiceGraphTypeDefs, {
        serviceName: service.name,
      }),
      backAdditionalServiceTypeDefsTmpl(printSchema(genGraphAdditionalServiceSchema(service)), options),
      addWarnings({options: args.options})
    );
  }

  // Graph resolvers
  if (options.genGraphResolvers && !options.typesOnly) {
    fileCreator.create(
      resolveBackPath(args, GenerationPathCategory.BackAdditionalServiceGraphResolvers, {
        serviceName: service.name,
      }),
      backAdditionalServiceResolversTmpl(args),
      addWarnings({options: args.options})
    );
  }

  if (!options.typesOnly) {
    // Permissions
    fileCreator.create(
      resolveBackPath(args, GenerationPathCategory.BackAdditionalServiceGraphPermissionsToGraphql, {
        serviceName: service.name,
      }),
      backAdditionalServicePermissionToGraphqlTmpl(args),
      addWarnings({options: args.options})
    );
  }
}

export default generateBackAdditionalService;
