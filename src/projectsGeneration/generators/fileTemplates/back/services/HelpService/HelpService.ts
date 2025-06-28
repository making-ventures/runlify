import {plural} from 'pluralize'
import {ProjectWideGenerationArgs} from '../../../../../args'

const helpServiceTmpl = ({
  entities,
}: ProjectWideGenerationArgs) => `import fs from 'fs-jetpack';

export interface HelpService {
  getHelp: (entityName: string) => Promise<string>;
}

const infoFilesForService = {
${entities.map((m) => `  ${m.name}: 'docs/${plural(m.type)}/${m.name}.md',`)
  .join(`
`)}
};

export const getHelpService = (): HelpService => {
  const getHelp = async (entityName: string) => {
    const foundDoc = infoFilesForService[entityName];

    if (!foundDoc) {
      throw new Error(\`No info document found for entity type: \${entityName}\`);
    }

    return fs.read(foundDoc) as string;
  };

  return {
    getHelp,
  };
};
`

export default helpServiceTmpl
