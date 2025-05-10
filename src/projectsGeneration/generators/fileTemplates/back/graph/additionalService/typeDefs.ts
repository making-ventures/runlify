import {
  BootstrapEntityOptions,
  defaultBootstrapEntityOptions,
} from '../../../../../types'
import {printWarningIfRequired, pad1} from '../../../../../utils'

export const backAdditionalServiceTypeDefsTmpl = (
  printedSchema: string,
  options: BootstrapEntityOptions = defaultBootstrapEntityOptions
) => {
  const scheme = pad1(printedSchema.replaceAll('`', "'"));
  const maxLenght = Math.max(...scheme.split('\n').map(el => el.length))

  return `${
    maxLenght > 140
      ? `/* eslint-disable max-len */
`
      : ''}import {gql} from 'apollo-server';
${printWarningIfRequired(options)}
export default gql\`
${scheme}
\`;
`.trimStart()}
