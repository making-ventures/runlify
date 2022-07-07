/* eslint-disable max-len */
import { plural } from 'pluralize'
import { pascal, pascalSingular } from '../../../../../../utils/cases'
import { EntityWideGenerationArgs } from '../../../../../args'
import { pad4, generatedWarning } from '../../../../../utils'

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
    <Show actions={<DefaultActions />} {...props}>
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
      }.title')} path='${entity.name}-${link.fromField.name}' />`
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
