export const backCustomUiPermissionsTmpl = () => `// UI-only permissions (checked on the frontend only, never enforced by the
// backend) that aren't covered by the generated "ui.<entity>.list" set — add
// them here by hand. This file is generated once and never overwritten.
const customUiPermissions: string[] = [];

export default customUiPermissions;
`

export default backCustomUiPermissionsTmpl
