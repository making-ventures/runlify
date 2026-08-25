const uiPermissionsTmpl = () => `import {ComponentType} from 'react';
import PermissionPage from '../adm/PermissionPage';

export const hasPermission = (currentPermissions: string[] | undefined, requiredPermission: string) => {
  if (!currentPermissions || currentPermissions.length === 0) {
    return false;
  }

  return currentPermissions.includes(requiredPermission);
};

export const hasAnyPermission = (currentPermissions: string[] | undefined, requiredPermissions: string[]) => {
  if (requiredPermissions.length === 0) {
    return true;
  }

  if (!currentPermissions || currentPermissions.length === 0) {
    return false;
  }

  return requiredPermissions.some(permission => currentPermissions.includes(permission));
};

export const hasAllPermissions = (currentPermissions: string[] | undefined, requiredPermissions: string[]) => {
  if (!requiredPermissions || requiredPermissions.length === 0) {
    return true;
  }

  if (!currentPermissions || currentPermissions.length === 0) {
    return false;
  }

  return requiredPermissions.every(permission => currentPermissions.includes(permission));
};

export const withPermission = <P extends object>(
  currentPermissions: string[] | undefined,
  requiredPermissions: string | string[],
  Component: ComponentType<P>,
) => (
    hasAllPermissions(
      currentPermissions,
      Array.isArray(requiredPermissions) ? requiredPermissions : [requiredPermissions],
    ) ? Component : PermissionPage
  );
`

export default uiPermissionsTmpl
