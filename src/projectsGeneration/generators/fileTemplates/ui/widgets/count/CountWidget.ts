import {pascal, pascalSingular} from '../../../../../../utils/cases'
import {EntityWideGenerationArgs} from '../../../../../args'

export const uiCountWidgetTmpl = ({
  entity,
}: EntityWideGenerationArgs) => `import React, {
  FC,
} from 'react';
import NumberWidget, {
  NumberWidgetProps,
} from '../../../widgets/NumberWidget';
import {
  gql,
} from '@apollo/client';
import {${pascalSingular(entity.name)}Filter} from '../../../generated/graphql';

interface Count${pascal(entity.name)}WidgetProps extends
Omit<NumberWidgetProps, 'request' | 'resultToValue'> {
  filter?: ${pascalSingular(entity.name)}Filter;
}

const Count${pascal(entity.name)}Widget: FC<Count${pascal(
  entity.name
)}WidgetProps> = ({
  filter,
  ...rest
}) => {
  return (
    <NumberWidget
      measuring='шт'
      {...rest}
      options={{
        variables: {
          filter,
        },
      }}
      request={gql\`
        query ($filter: ${pascalSingular(entity.name)}Filter) {
          _all${pascal(entity.name)}Meta(filter: $filter) {
            count
          }
        }
      \`}
      resultToValue={result => result?._all${pascal(
        entity.name
      )}Meta?.count?.toLocaleString()}
    />
  );
};

export default Count${pascal(entity.name)}Widget;
`
