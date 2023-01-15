import { getCompNamesToShowField } from '../../../../ui/componentNames/show/getCompNamesToShowField'
import * as R from 'ramda'
import { getShowComponent } from '../../../../ui/getShowComponent'
import { EntityWideGenerationArgs } from '../../../../../args'
import { pad3, generatedWarning, pad2 } from '../../../../../utils'
import {isMarkdownField} from "../../../../../metaUtils";

export const uiEntityShowDefaultMainTabTmpl = ({
  allEntities,
  entity,
  options,
}: EntityWideGenerationArgs) => {
  // const fieldsToImport = R.flatten(entity.fields.filter(f => !f.hidden))
  const fieldsToImport = R.flatten(entity.fields.filter(f => !f.hidden).filter(f => !isMarkdownField(f)))
  const dateFieldsToImport = fieldsToImport.filter((f) =>
    ['datetime', 'date'].includes(f.type)
  )
  const notDateFieldsToImport = fieldsToImport.filter(
    (f) => !['datetime', 'date'].includes(f.type)
  )
  const reactAdminImports: string[] = [
    'Tab',
    'TabProps',

    ...R.flatten(
      notDateFieldsToImport.map((f) => getCompNamesToShowField(f, allEntities))
    ),
  ]

  return `/* eslint-disable max-len */
import React, {FC} from 'react';
import {
  ${R.uniq(reactAdminImports.map((el) => `${el},`)).join(`
  `)}
  Labeled,
} from 'react-admin';${
    dateFieldsToImport.some((f) => ['date', 'datetime'].includes(f.type))
      ? `
import DateField from '../../../../uiLib/DateField';`
      : ''
  }
import {Grid} from '@mui/material';
${entity.fields.some(isMarkdownField) ? 'import ReactMarkdownField from \'../../../../uiLib/ReactMarkdownField\';\n' : ''}
${
  options.skipWarningThisIsGenerated
    ? ''
    : `// ${generatedWarning}
`
}
const DefaultMainTab: FC<Omit<TabProps, 'children'>> = (props) => {
  return (<Tab {...props}>
    <Grid container spacing={2}>
${entity.fields
  .filter((f) => !f.hidden)
  .map(
    (f) => `<Grid item ${isMarkdownField(f) ? 'xs={12} sm={12} md={12} lg={12}' : 'xs={12} sm={6} md={3} lg={2}'}>
  <Labeled>
${pad2(getShowComponent(entity, allEntities, f))}
  </Labeled>
</Grid>`
  )
  .map(pad3)
  .join('\n')}
    </Grid>
  </Tab>);
};

export default DefaultMainTab;
`
}
