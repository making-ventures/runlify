import {join} from 'path'
import {pascal} from '../../../../../utils/cases'
import {printSchema} from 'graphql'
import {AdditionalServiceWideGenerationArgs} from '../../../../args'
import {backAdditionalServiceResolversTmpl} from '../../../../generators/fileTemplates/back/graph/additionalService/resolvers'
import {backAdditionalServiceTypeDefsTmpl} from '../../../../generators/fileTemplates/back/graph/additionalService/typeDefs'
import {backAdditionalServicePermissionToGraphqlTmpl} from '../../../../generators/fileTemplates/back/graph/additionalService/permissionToGraphql'
import {genGraphAdditionalServiceSchema} from '../../../../generators/graph/genGraphAdditionalServiceSchema'
import {backAdditionalServiceTypesTmpl} from '../../../../generators/fileTemplates/back/services/additionalService/types'
import {FileCreator} from '../../../types'

const generateBackAdditionalService = (
  fileCreator: FileCreator,
  args: AdditionalServiceWideGenerationArgs,
) => {
  const {service, options} = args;
  let prjBackSrcPrefixedDir = '';
  const prjDetachedBackSrcDir = join(options.detachedBackProject, 'src');

  prjBackSrcPrefixedDir = join(prjDetachedBackSrcDir, 'adm');

  const serviceName = `${pascal(service.name)}Service`;
  const serviceDir = join(prjBackSrcPrefixedDir, 'services', serviceName);

  fileCreator.create(join(serviceDir, 'types.ts'), backAdditionalServiceTypesTmpl(args));

  // Graph
  const graphServiceDir = join(prjBackSrcPrefixedDir, 'graph', 'services', service.name);

  // Graph schema
  if (options.genGraphSchema) {
    fileCreator.create(
      join(graphServiceDir, 'typeDefs.ts'),
      backAdditionalServiceTypeDefsTmpl(printSchema(genGraphAdditionalServiceSchema(service)), options)
    );
  }

  // Graph resolvers
  if (options.genGraphResolvers && !options.typesOnly) {
    fileCreator.create(`${graphServiceDir}/resolvers.ts`, backAdditionalServiceResolversTmpl(args));
  }

  if (!options.typesOnly) {
    // Permissions
    fileCreator.create(`${graphServiceDir}/permissionsToGraphql.ts`, backAdditionalServicePermissionToGraphqlTmpl(args));
  }
}

export default generateBackAdditionalService;