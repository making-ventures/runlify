import { getCompNamesToShowField } from '../../../../ui/componentNames/show/getCompNamesToShowField'
import * as R from 'ramda'
import { getShowComponent } from '../../../../ui/getShowComponent'
import { EntityWideGenerationArgs } from '../../../../../args'
import { pad3, generatedWarning, pad2 } from '../../../../../utils'

export const uiEntityShowDefaultMainTabTmpl = ({
  allEntities,
  entity,
  options,
}: EntityWideGenerationArgs) => {
  const fieldsToImport = R.flatten(entity.fields.filter((f) => !f.hidden))
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
  useTranslate,
  Labeled,
} from 'react-admin';${
    dateFieldsToImport.some((f) => ['date', 'datetime'].includes(f.type))
      ? `
import DateField from '../../../../uiLib/DateField';`
      : ''
  }
import {Grid} from '@mui/material';
${
  options.skipWarningThisIsGenerated
    ? ''
    : `
// ${generatedWarning}
`
}
const DefaultMainTab: FC<Omit<TabProps, 'children'>> = (props) => {
  const translate = useTranslate();

  return (<Tab {...props}>
    <Grid container spacing={2}>
${entity.fields
  .filter((f) => !f.hidden)
  .map(
    (f) => `<Grid item xs={12} sm={6} md={3} lg={2}>
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
