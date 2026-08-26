import {join} from 'path'
import {FileCreator} from '../../types'
import {configItemsTmpl} from '../../../generators/fileTemplates/back/root/config/config'
import {ProjectWideGenerationArgs} from '../../../args'
import generateBackEnumsAndInits from './enums/generateBackEnumsAndInits'
import generateBackHelpService from './generateBackHelpService'
import generateBackIntegrationClients from './generateBackIntegrationClients'
import generateBackAdditionalServices from './additionalServices/generateBackAdditionalServices'
import generateBackServices from './services/generateBackServices'
import { backPermissionToGraphqlTmpl } from '../../../generators/fileTemplates/back/graph/permissionsToGraphql'
import { restRouterTmpl } from '../../../generators/fileTemplates/back/root/restRouter'
import { backInitPermissionsTmpl } from '../../../generators/fileTemplates/back/roles/initPermissions'
import { backUiPermissionsTmpl } from '../../../generators/fileTemplates/back/roles/uiPermissions'
import { backCustomPermissionsTmpl } from '../../../generators/fileTemplates/back/roles/customPermissions'
import { backCustomUiPermissionsTmpl } from '../../../generators/fileTemplates/back/roles/customUiPermissions'
import {addWarnings, addGeneratedOnceNotice} from '../../fileHandlers'

const generateBackSrc = (fileCreator: FileCreator, args: ProjectWideGenerationArgs) => {
  if (!args.options.typesOnly) {
    fileCreator.create(
      join(args.options.detachedBackProject, 'src', 'config', 'config.ts'),
      configItemsTmpl(args),
      addWarnings({options: args.options})
    );

    generateBackEnumsAndInits(fileCreator, args);
  }

  generateBackServices(fileCreator, args);
  generateBackIntegrationClients(fileCreator, args);
  generateBackAdditionalServices(fileCreator, args);

  generateBackHelpService(fileCreator, args);


  const prjDetachedBackSrcDir = join(args.options.detachedBackProject, 'src');

  // Graph
  fileCreator.create(
    join(prjDetachedBackSrcDir, 'adm', 'graph', 'permissionsToGraphql.ts'),
    backPermissionToGraphqlTmpl(args),
    addWarnings({options: args.options})
  );

  // Root
  fileCreator.createIfNotExists(
    join(prjDetachedBackSrcDir, 'rest', 'restRouter.ts'),
    restRouterTmpl()
  );

  // Roles/permissions
  const rolesDir = join(prjDetachedBackSrcDir, 'init', 'roles');
  fileCreator.create(
    join(rolesDir, 'initPermissions.ts'),
    backInitPermissionsTmpl(),
    addWarnings({options: args.options})
  );
  fileCreator.create(
    join(rolesDir, 'uiPermissions.ts'),
    backUiPermissionsTmpl(args),
    addWarnings({options: args.options})
  );
  fileCreator.createIfNotExists(
    join(rolesDir, 'customPermissions.ts'),
    backCustomPermissionsTmpl(),
    [addGeneratedOnceNotice]
  );
  fileCreator.createIfNotExists(
    join(rolesDir, 'customUiPermissions.ts'),
    backCustomUiPermissionsTmpl(),
    [addGeneratedOnceNotice]
  );
}

export default generateBackSrc;
