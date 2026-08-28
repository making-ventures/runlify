import {ProjectWideGenerationArgs} from '../../../../args'

export const backUiPermissionsTmpl = ({
  entities,
  options,
}: ProjectWideGenerationArgs) => {
  const systemPermissions = [
    options.genUiDashboard ? 'ui.dashboard' : undefined,
    options.showFunctionsInMenu ? 'ui.functions' : undefined,
    options.showResourcesInMenu ? 'ui.resources' : undefined,
    options.showMetaInMenu ? 'ui.meta' : undefined,
  ].filter(Boolean)

  return `// UI-only permissions: access to the entity's list page (and a few
// non-entity system pages). Checked only on the frontend, never enforced by
// the backend.
const uiPermissions: string[] = [
${entities.map((e) => `  'ui.${e.name}.list',`).join('\n')}
${systemPermissions.map((p) => `  '${p}',`).join('\n')}
];

export default uiPermissions;
`
}

export default backUiPermissionsTmpl
