import {pascal} from '../../../../../../utils/cases'
import {AdditionalServiceWideGenerationArgs} from '../../../../../args'

export const backAdditionalServicePermissionToGraphqlTmpl = ({
  service,
}: AdditionalServiceWideGenerationArgs) =>
  `import ${pascal(
    service.name
  )}Service from '../../../services/${pascal(
    service.name
  )}Service/${pascal(service.name)}Service';
import {PermissionToGraphql} from '../../permissionsToGraphql';

const ${
    service.name
  }PermissionToGraphql: Partial<PermissionToGraphql<${pascal(
    service.name
  )}Service>> = ${service.methods.filter(m => m.exportedToApi).length ? `{
${service.methods.filter(m => m.exportedToApi).map(method => `  ${method.name}: '${service.name}${pascal(method.name)}',`).join('\n')}
};` : '{};'}

export default ${service.name}PermissionToGraphql;
`
