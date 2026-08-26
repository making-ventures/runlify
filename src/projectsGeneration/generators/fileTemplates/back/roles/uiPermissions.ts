import {ProjectWideGenerationArgs} from '../../../../args'

export const backUiPermissionsTmpl = ({
  entities,
}: ProjectWideGenerationArgs) => `// UI-only permissions: access to the entity's list page. Checked only on the
// frontend, never enforced by the backend.
const uiPermissions: string[] = [
${entities.map((e) => `  'ui.${e.name}.list',`).join('\n')}
];

export default uiPermissions;
`

export default backUiPermissionsTmpl
