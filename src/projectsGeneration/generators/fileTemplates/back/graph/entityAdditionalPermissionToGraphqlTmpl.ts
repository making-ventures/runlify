import {pascalPlural} from '../../../../../utils/cases'
import {EntityWideGenerationArgs} from '../../../../args'

export const backEntityAdditionalPermissionToGraphqlTmpl = ({
  entity,
}: EntityWideGenerationArgs) => `import ${
  entity.name
}BasePermissionToGraphql from './basePermissionsToGraphql';
import ${
  entity.name
}AdditionalPermissionToGraphql from './additionalPermissionsToGraphql';
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
    ...${entity.name}AdditionalPermissionToGraphql,
  };

export default ${entity.name}PermissionToGraphql;
`
