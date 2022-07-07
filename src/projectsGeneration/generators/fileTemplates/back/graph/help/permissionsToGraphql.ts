const permissionsToGraphqlTmpl =
  () => `import {PermissionToGraphql} from '../../permissionsToGraphql';
import {HelpService} from '../../../services/HelpService/HelpService';

const helpPermissionToGraphql: Partial<PermissionToGraphql<HelpService>> = {
  getHelp: 'getHelp',
};

export default helpPermissionToGraphql;

`

export default permissionsToGraphqlTmpl
