import {EntityWideGenerationArgs} from '../../../../../args'

const backDocsEntity = ({
  system,
  entity,
}: EntityWideGenerationArgs) => `
# ${entity.title[system.defaultLanguage].plural}

Need for: ${entity.needFor[system.defaultLanguage]}

`

export default backDocsEntity;
