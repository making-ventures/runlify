import { pascalPlural } from '../../../../../utils/cases'
import { EntityWideGenerationArgs } from '../../../../args'
import {printWarningIfRequired} from '../../../../utils'

export const backEntityPermissionToGraphqlTmpl = ({
  entity,
  options,
}: EntityWideGenerationArgs) => `import ${
  entity.name
}BasePermissionToGraphql from './basePermissionsToGraphql';
import {${pascalPlural(
  entity.name
)}Service} from '../../../services/${pascalPlural(
  entity.name
)}Service/${pascalPlural(entity.name)}Service';
import {PermissionToGraphql} from '../../permissionsToGraphql';
${printWarningIfRequired(options)}
const ${
  entity.name
}PermissionToGraphql:
  Partial<PermissionToGraphql<${pascalPlural(
    entity.name
  )}Service>> = {
    ...${entity.name}BasePermissionToGraphql,
  };

export default ${entity.name}PermissionToGraphql;
`
