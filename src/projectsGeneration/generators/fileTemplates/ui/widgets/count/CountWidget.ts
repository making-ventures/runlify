import { pascal, pascalSingular } from '../../../../../../utils/cases'
import { EntityWideGenerationArgs } from '../../../../../args'
import { generatedWarning } from '../../../../../utils'

export const uiCountWidgetTmpl = ({
  entity,
  options,
}: EntityWideGenerationArgs) => `/* eslint-disable max-len */
import React, {
  FC,
} from 'react';
import NumberWiget, {
  NumberWigetProps,
} from '../../../widgets/NumberWiget';
import {
  gql,
} from '@apollo/client';
import {${pascalSingular(entity.name)}Filter} from '../../../generated/graphql';
${
  options.skipWarningThisIsGenerated
    ? ''
    : `
// ${generatedWarning}
`
}
interface Count${pascal(entity.name)}WidgetProps extends
Omit<NumberWigetProps, 'request' | 'resultToValue'> {
  filter?: ${pascalSingular(entity.name)}Filter;
}

const Count${pascal(entity.name)}Widget: FC<Count${pascal(
  entity.name
)}WidgetProps> = ({
  filter,
  ...rest
}) => {
  return (
    <NumberWiget
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
