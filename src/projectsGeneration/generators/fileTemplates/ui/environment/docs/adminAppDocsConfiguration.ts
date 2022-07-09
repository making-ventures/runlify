/* eslint-disable max-len */
import { constantCase } from 'change-case'
import markdownTable from 'markdown-table'
import { ProjectWideGenerationArgs } from '../../../../../args'

export const adminAppDocsConfiguration = ({
  system,
}: ProjectWideGenerationArgs) => {
  const adminVars = system.configVars.filter((v) =>
    v.scopes.includes('admin-app')
  )

  return `
# Configuration

Project takes configurations from two places: from config files in \`projectRoot/config\` folder and from environment variables.

Environment variables takes precedence.

## Loading from files

There is two files, configuration will be loaded from: \`default.json\` and \`\${ENV}.json\` where \`\${ENV}\` is \`ENV\` environment variable or \`dev\` if \`ENV\` environment variable is not set.

If both files exists they will be merged. \`\${ENV}.json\` takes precedence.

> **_WARNING:_**  \`default.json\` stored in git so do not put secret information in there (database credentials, passwords, etc.)

## Configuration variables

${markdownTable([
  ['Key in file', 'Environment', 'Description'],
  ...adminVars.map((v) => [v.name, constantCase(v.name), v.needFor]),
])}
`
}
