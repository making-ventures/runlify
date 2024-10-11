import {pascal, pascalPlural, pascalSingular, sentence} from '../../../../../../utils/cases';
import { EntityWideGenerationArgs } from '../../../../../args'
import { generatedWarning, pad1, pad5 } from '../../../../../utils'
// import { isMarkdownField } from '../../../../../metaUtils'

export const uiListWidgetTmpl = ({
  entity,
  options,
}: EntityWideGenerationArgs) => {
  const fields = entity.fields
    .filter((f) => !f.hidden)
    .filter(f => f.showInList)
    .map(
      (f) => `<div>
  {\`${sentence(f.name)}: \${props.${f.name}}\`}
</div>`
    )

  return `/* eslint-disable max-len */
import React, {
  FC,
} from 'react';
import {
  gql,
} from '@apollo/client';
import {
  Link,
} from 'react-router-dom';
import {ListItem, ListItemText} from '@mui/material';
import ListWidget, {
  ListWidgetProps,
} from '../../../widgets/ListWidget';
import {
  ${pascalSingular(entity.name)},
  QueryAll${pascalPlural(entity.name)}Args,
} from '../../../generated/graphql';
${
  options.skipWarningThisIsGenerated
    ? ''
    : `
// ${generatedWarning}
`
}
interface List${pascal(entity.name)}WidgetProps extends
Omit<ListWidgetProps<${pascalSingular(
    entity.name
  )}>, 'request' | 'resultToValue'| 'children' | 'source'>,
QueryAll${pascalPlural(entity.name)}Args {
  children?: FC<${pascalSingular(entity.name)}>,
}

export const List${pascal(entity.name)}Item: FC<${pascalSingular(
    entity.name
  )}> = (props) => {
  return (
    <ListItem
      button
      component={Link}
      key={props.id}
      to={\`/${entity.name}/\${props.id}/show\`}
    >
      <ListItemText
        primary={
${
  fields.length > 1
    ? pad5(`<>
${fields.map(pad1).join('\n')}
</>`)
    : fields.map(pad5).join('\n')
}
        }
      />
    </ListItem>
  );
};

const List${pascal(entity.name)}Widget: FC<List${pascal(
    entity.name
  )}WidgetProps> = ({
  page = 0,
  perPage = 5,
  sortField,
  sortOrder,
  filter,
  children = List${pascal(entity.name)}Item,
  ...rest
}) => {
  return (
    <ListWidget<${pascalSingular(entity.name)}>
      {...rest}
      source='${entity.name}'
      options={{
        variables: {
          page,
          perPage,
          sortField,
          sortOrder,
          filter,
        },
      }}
      request={gql\`
        query (
          $page: Int,
          $perPage: Int,
          $sortField: String,
          $sortOrder: String,
          $filter: ${pascalSingular(entity.name)}Filter,
        ) {
          all${pascal(entity.name)}(
            page: $page,
            perPage: $perPage,
            sortField: $sortField,
            sortOrder: $sortOrder,
            filter: $filter
          ) {
            ${entity.fields.filter((f) => !f.hidden).map((f) => f.name).join(`
            `)}
          }
        }
      \`}
      resultToValue={result => result?.all${pascal(entity.name)}}
    >
      {(record) => children(record)}
    </ListWidget>
  );
};

export default List${pascal(entity.name)}Widget;
`
}
