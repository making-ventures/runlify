export const backInitPermissionsTmpl = () => `import {Context} from '../../../adm/services/types';
import {getRuntimePermissions} from '../../../adm/services/getRuntimePermissions';
import uiPermissions from './uiPermissions';
import customPermissions from '../customPermissions';
import customUiPermissions from '../customUiPermissions';

const initPermissions = async (ctx: Context) => {
  const runtimePermissions = getRuntimePermissions(ctx);
  const runtimePermissionIds = runtimePermissions.map(p => p.id);

  const permissions = [
    ...runtimePermissionIds,
    ...uiPermissions,
    ...customPermissions,
    ...customUiPermissions,
  ];

  await ctx.service('permissions').createMany(permissions.map(p => ({
    id: p,
    title: p,
  })));
};

export default initPermissions;
`

export default backInitPermissionsTmpl
