import {pascalPlural} from '../../../../utils/cases'
import {ProjectWideGenerationArgs} from '../../../args'
import {plural} from 'pluralize'

export const uiResourcesPageTmpl = ({
  entities,
}: ProjectWideGenerationArgs) => {
  return `import React, {
  FC,
} from 'react';
import NumberWidget from '../widgets/NumberWidget';
import {
  gql,
} from '@apollo/client';
import {Title, useTranslate} from 'react-admin';
import {Grid} from 'shared/Components/Grid';

const ResourcesPage: FC = () => {
  const translate = useTranslate();

  return (
    <Grid container>
      <Title title='app.resources' />
${entities.map((entity) => {
  return `      <NumberWidget
        request={gql\`
          query {
            _all${pascalPlural(entity.name)}Meta {
              count
            }
          }
        \`}
        resultToValue={result => result?._all${pascalPlural(
          entity.name
        )}Meta?.count}
        title={translate('${plural(entity.type)}.${entity.name}.title.plural')}
        to='/${entity.name}'
      />`
}).join(`
`)}
    </Grid>
  );
};

export default ResourcesPage;
`
}
