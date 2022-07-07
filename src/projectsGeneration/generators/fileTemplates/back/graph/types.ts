import {
  BootstrapEntityOptions,
  defaultBootstrapEntityOptions,
} from '../../../../types'
import { generatedWarning, pad1 } from '../../../../utils'

export const backBaseTypesTmpl = (
  printedSchema: string,
  options: BootstrapEntityOptions = defaultBootstrapEntityOptions
) => `import {gql} from 'apollo-server';
${
  options.skipWarningThisIsGenerated
    ? ''
    : `
// ${generatedWarning}
`
}
export default gql\`
${pad1(printedSchema.replaceAll('`', "'"))}
\`;
`
