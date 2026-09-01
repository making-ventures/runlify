const uiPermissionsTmpl = () => `import {ComponentType} from 'react';
import PermissionPage from '../adm/PermissionPage';


const matchesPermission = (currentPermissions: string[], requiredPermission: string) => {
  if (requiredPermission.endsWith('.*')) {
    const prefix = requiredPermission.slice(0, -1);
    return currentPermissions.some(permission => permission.startsWith(prefix));
  }

  return currentPermissions.includes(requiredPermission);
};

/**
 * Returns true if \`currentPermissions\` satisfies \`requiredPermission\`.
 *
 * \`requiredPermission\` may end in \`.*\` (e.g. \`'foo.bar.*'\`) to match any permission from
 * that family — satisfied if at least one current permission starts with \`'foo.bar.'\`.
 * A plain string without the \`.*\` suffix is matched by exact equality.
 */
export const hasPermission = (currentPermissions: string[] | undefined, requiredPermission: string) => {
  if (!currentPermissions || currentPermissions.length === 0) {
    return false;
  }

  return matchesPermission(currentPermissions, requiredPermission);
};

/**
 * Returns true if \`currentPermissions\` satisfies at least one of \`requiredPermissions\`.
 * An empty required list always passes.
 *
 * Any entry ending in \`.*\` (e.g. \`'foo.bar.*'\`) matches any permission from that family
 * (at least one current permission starting with \`'foo.bar.'\`) instead of an exact string.
 */
export const hasAnyPermission = (currentPermissions: string[] | undefined, requiredPermissions: string[]) => {
  if (requiredPermissions.length === 0) {
    return true;
  }

  if (!currentPermissions || currentPermissions.length === 0) {
    return false;
  }

  return requiredPermissions.some(permission => matchesPermission(currentPermissions, permission));
};

/**
 * Returns true if \`currentPermissions\` satisfies every one of \`requiredPermissions\`.
 * An empty required list always passes.
 *
 * Any entry ending in \`.*\` (e.g. \`'foo.bar.*'\`) matches any permission from that family
 * (at least one current permission starting with \`'foo.bar.'\`) instead of an exact string.
 */
export const hasAllPermissions = (currentPermissions: string[] | undefined, requiredPermissions: string[]) => {
  if (!requiredPermissions || requiredPermissions.length === 0) {
    return true;
  }

  if (!currentPermissions || currentPermissions.length === 0) {
    return false;
  }

  return requiredPermissions.every(permission => matchesPermission(currentPermissions, permission));
};

/**
 * Returns \`Component\` if \`currentPermissions\` satisfies all of \`requiredPermissions\`,
 * otherwise returns \`PermissionPage\` (an access-denied fallback) — used so that a
 * \`<Resource>\` prop is never \`undefined\`, keeping its route registered either way.
 *
 * Any entry ending in \`.*\` (e.g. \`'foo.bar.*'\`) matches any permission from that family
 * (at least one current permission starting with \`'foo.bar.'\`) instead of an exact string.
 */
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
