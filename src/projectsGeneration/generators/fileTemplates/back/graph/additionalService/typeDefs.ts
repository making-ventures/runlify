import {
  BootstrapEntityOptions,
  defaultBootstrapEntityOptions,
} from '../../../../../types'
import {pad1} from '../../../../../utils'

export const backAdditionalServiceTypeDefsTmpl = (
  printedSchema: string,
  _options: BootstrapEntityOptions = defaultBootstrapEntityOptions
) => {
  const scheme = pad1(printedSchema.replaceAll('`', "'"));

  return `import gql from 'graphql-tag';

export default gql\`
${scheme}
\`;
`.trimStart()}
