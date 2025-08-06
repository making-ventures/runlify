import {pascalPlural} from '../../../../../utils/cases'
import {EntityWideGenerationArgs} from '../../../../args'

export const backEntityPermissionToGraphqlTmpl = ({
  entity,
}: EntityWideGenerationArgs) => `import ${
  entity.name
}BasePermissionToGraphql from './basePermissionsToGraphql';
import {${pascalPlural(
  entity.name
)}Service} from '../../../services/${pascalPlural(
  entity.name
)}Service/${pascalPlural(entity.name)}Service';
import {PermissionToGraphql} from '../../permissionsToGraphql';

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
