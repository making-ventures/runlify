import {pascalPlural, pascalSingular} from '../../../../../utils/cases'
import {EntityWideGenerationArgs} from '../../../../args'


export const backBasePermissionToGraphqlTmpl = ({
  entity,
}: EntityWideGenerationArgs) =>
  `import {${pascalPlural(
    entity.name
  )}Service} from '../../../services/${pascalPlural(
    entity.name
  )}Service/${pascalPlural(entity.name)}Service';
import {PermissionToGraphql} from '../../permissionsToGraphql';

const ${
    entity.name
  }BasePermissionToGraphql:
  Partial<PermissionToGraphql<${pascalPlural(
    entity.name
  )}Service>> = {
    meta: '_all${pascalPlural(entity.name)}Meta',
    get: '${pascalSingular(entity.name)}',
    all: 'all${pascalPlural(entity.name)}',
    create: 'create${pascalSingular(entity.name)}',
    update: 'update${pascalSingular(entity.name)}',
    delete: 'remove${pascalSingular(entity.name)}',
  };

export default ${entity.name}BasePermissionToGraphql;
`
