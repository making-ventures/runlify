import { EntityWideGenerationArgs } from '../../../../../args'

export const backDocsEntity = ({
  system,
  entity,
}: EntityWideGenerationArgs) => `
# ${entity.title[system.defaultLanguage]}

Need for: ${entity.needFor[system.defaultLanguage]}

`
