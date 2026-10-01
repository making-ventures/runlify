/**
 * Текст типа данных дескриптора (`uiLib/entityPages/descriptorTypes.ts` в проекте).
 * Единый источник правды по форме данных дескриптора: версионируется вместе с runlify.
 */
export const uiDescriptorTypesTmpl = () => `export type EntityPageType = 'catalog' | 'document' | 'infoRegistry' | 'sumRegistry';
export type DescriptorFieldType = 'string' | 'int' | 'bigint' | 'float' | 'bool' | 'datetime' | 'date';
export type DescriptorFilterOp = 'equal' | 'defined' | 'not_defined' | 'in' | 'not_in' | 'lt' | 'lte' | 'gt' | 'gte';

export interface DescriptorField {
  name: string;
  type: DescriptorFieldType;
  category: 'scalar' | 'link' | 'id';
  labelKey: string;              // \`\${plural(entity.type)}.\${entity.name}.fields.\${name}\` (getShowComponent.ts:12-14)
  hidden: boolean;
  required: boolean;             // фильтр: без defaultValue={null} у required (DefaultEntityEdit.ts:50)
  showInList: boolean;
  showInShow: boolean;
  showInFilter: boolean;
  filters: DescriptorFilterOp[];
  stringType?: 'plain' | 'multiline' | 'markdown' | 'number' | 'richEdit' | 'json';
  numberType?: 'base' | 'money';
  link?: {                        // только category === 'link'
    entity: string;              // externalEntity
    isImage: boolean;            // predefinedLinkedEntity === 'file' && fileType === 'image' (metaUtils.ts:48-52)
    sort: {field: string; order: 'ASC' | 'DESC'};   // linkedEntity.sortField/sortOrder для ReferenceInput (DefaultEntityEdit.ts:66-68)
    permissions: {all: string; get: string};        // \`\${ext}.all\` (показ колонки/инпута), \`\${ext}.get\` (ссылка)
  };
}

export interface DescriptorFilterField { name: string; hidden: boolean; alwaysOn: boolean }   // forms.list.filter.fields как есть

export interface DescriptorDependencyTab {
  ownerEntity: string;           // link.entityOwnerName
  ownerType: EntityPageType;
  fromField: string;             // link.fromField.name
  path: string;                  // \`\${ownerEntity}-\${fromField}\` — deep-link сохраняется (DefaultEntityShow.ts:87)
  labelKey: string;              // \`\${plural(ownerType)}.\${ownerEntity}.title.plural\`
  permissions: {get: string};    // \`\${ownerEntity}.get\` → rowClick (DependencyTab.ts:81)
  fields: DescriptorField[];     // ВСЕ !hidden поля владельца без markdown, порядок меты, labelKey владельца (DependencyTab.ts:84-92; showInList НЕ учитывается)
}

export interface EntityDescriptorData {
  name: string;
  type: EntityPageType;
  names: {singular: string; pascalSingular: string};  // OpenRegistries document=singular, RePost serviceName=pascalSingular (DefaultActions.ts:29-45)
  i18n: {titlePlural: string; titleSingular: string};
  sort: {field: string; order: 'ASC' | 'DESC'};
  removableByUser: boolean;
  updatableByUser: boolean;
  exportableByUser: boolean;
  hasSearch: boolean;            // type==='catalog' || type==='document' || (type==='infoRegistry' && searchEnabled) (DefaultEntityFilter.ts:18)
  registrarDepended: boolean;    // infoRegistry/sumRegistry → <RegistrarField label='Registrar' /> (DefaultEntityList.ts:47-50,113-116)
  registries: Array<{name: string; type: 'infoRegistry' | 'sumRegistry'}>;  // только document (DefaultActions.ts:35-38)
  permissions: {get: string; update: string; delete: string; all: string};
  filterFields: DescriptorFilterField[];
  fields: DescriptorField[];     // entity.fields в порядке меты, включая hidden/id/search (фильтруют компоненты)
  dependencyTabs: DescriptorDependencyTab[];   // toLinks минус forms.show.ignoredLinkedEntities (DefaultEntityShow.ts:27-31), порядок toLinks
}

export type EntityDescriptor<TSlots = Record<string, unknown>> = EntityDescriptorData & {slots: TSlots};
`
