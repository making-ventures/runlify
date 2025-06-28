import {pascal, pascalSingular} from '../../../../../../utils/cases'
import {EntityWideGenerationArgs} from '../../../../../args'
import {printWarningIfRequired} from '../../../../../utils'

export const uiCountWidgetTmpl = ({
  entity,
  options,
}: EntityWideGenerationArgs) => `/* eslint-disable max-len */
import React, {
  FC,
} from 'react';
import NumberWidget, {
  NumberWidgetProps,
} from '../../../widgets/NumberWidget';
import {
  gql,
} from '@apollo/client';
import {${pascalSingular(entity.name)}Filter} from '../../../generated/graphql';
${printWarningIfRequired(options)}
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
