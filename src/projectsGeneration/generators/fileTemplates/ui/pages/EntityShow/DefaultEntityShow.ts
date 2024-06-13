/* eslint-disable max-len */
import { plural } from 'pluralize'
import { pascal, pascalSingular } from '../../../../../../utils/cases'
import { EntityWideGenerationArgs } from '../../../../../args'
import { Entity } from '../../../../../builders'
import { pad4, generatedWarning } from '../../../../../utils'

const getEntityTitle = (entity: Entity) => {
  switch (entity.type) {
    case 'catalog':
      return 'CatalogTitle';
    case 'document':
      return 'DocumentTitle';
    case 'sumRegistry':
      return 'SumRegistryTitle';
    case 'infoRegistry':
      return 'InfoRegistryTitle';
    
    default:
      throw new Error(`Unknown entity type ${(entity as any).type}`);
  }
}

export const uiDefaultShowTmpl = ({
  allEntities,
  entity,
  toLinks,
  options,
}: EntityWideGenerationArgs) => {
  const linksWithEntities = toLinks.map((link) => {
    const entity = allEntities.get(link.entityOwnerName)

    if (!entity) {
      throw new Error(`The is no "${link.entityOwnerName}" entity`)
    }

    return {
      link,
      entity,
    }
  })

  const linkedTabCompImports = linksWithEntities.map(
    ({ entity, link }) =>
      `import ${pascal(entity.name)}${pascal(
        link.fromField.name
      )}Tab from './tabs/${pascal(entity.name)}${pascal(
        link.fromField.name
      )}Tab';`
  )

  return `/* eslint-disable max-len */
import React, {FC} from 'react';
import {
  Show,
  ShowProps,
  TabbedShowLayout,
  useTranslate,
} from 'react-admin';${
    linkedTabCompImports.length > 0
      ? `
${linkedTabCompImports.join(`
`)}`
      : ''
  }
import MainTab from './MainTab';
import {additionalTabs} from './additionalTabs';
import DefaultActions from './DefaultActions';
import ${getEntityTitle(entity)} from '../../../../raUiLib/${getEntityTitle(entity)}';${options.breadcrumb ?
    "\nimport {Breadcrumbs} from '../../../../raUiLib/Breadcrumbs';" : ''}
${
  options.skipWarningThisIsGenerated
    ? ''
    : `
// ${generatedWarning}
`
}
const Default${pascalSingular(
    entity.name
  )}Show: FC<ShowProps> = (props: ShowProps) => {
  const translate = useTranslate();

  return (
    <Show actions={${options.breadcrumb ? '<Breadcrumbs><DefaultActions /></Breadcrumbs>' : '<DefaultActions />'}} title={<${getEntityTitle(entity)} />} {...props}>
      <TabbedShowLayout>
        <MainTab label={translate('app.mainTab')} />
        {additionalTabs.map(({Tab, label}, i) => <Tab label={label} key={i} />)}${
          linkedTabCompImports.length > 0
            ? `
${linksWithEntities
  .map(
    ({ entity, link }) =>
      `<${pascal(entity.name)}${pascal(
        link.fromField.name
      )}Tab label={translate('${plural(entity.type)}.${
        entity.name
      }.title.plural')} path='${entity.name}-${link.fromField.name}' />`
  )
  .map(pad4)
  .join('\n')}`
            : ''
        }
      </TabbedShowLayout>
    </Show>
  );
};

export default Default${pascalSingular(entity.name)}Show;
`
}
