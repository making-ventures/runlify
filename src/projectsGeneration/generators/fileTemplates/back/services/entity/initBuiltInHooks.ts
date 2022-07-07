import { EntityWideGenerationArgs } from '../../../../../args'
import { pascalPlural } from '../../../../../../utils/cases'

export const initBuiltInHooksTmpl = ({ entity }: EntityWideGenerationArgs) => {
  const withTenantIdRequiredHooks = ['optional', 'required'].includes(
    entity.multitenancy
  )

  return `import {${pascalPlural(entity.name)}Service} from './${pascalPlural(
    entity.name
  )}Service';
${
  withTenantIdRequiredHooks
    ? "import {beforeUpdate, beforeUpsertStrict, beforeDelete, changeListFilter} from './hooks/tenantIdRequiredHooks';\n"
    : ''
}
// DO NOT EDIT! THIS IS GENERATED FILE
${
  withTenantIdRequiredHooks
    ? ''
    : `
// eslint-disable-next-line @typescript-eslint/no-empty-function`
}
const initBuiltInHooks = (${
    withTenantIdRequiredHooks ? '{hooksAdd}' : '_service'
  }: ${pascalPlural(entity.name)}Service) => {${
    withTenantIdRequiredHooks
      ? `
  hooksAdd.beforeUpdate(beforeUpdate);
  hooksAdd.beforeUpsertStrict(beforeUpsertStrict);
  hooksAdd.beforeDelete(beforeDelete);
  hooksAdd.changeListFilter(changeListFilter);
`
      : ''
  }};

export default initBuiltInHooks;
`
}
