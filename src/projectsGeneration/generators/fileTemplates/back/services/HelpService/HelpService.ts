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

function mustAssertHasKey<T extends object>(obj: T, key: PropertyKey, msg: string): asserts key is keyof T {
  if (!(key in obj)) {
    throw new Error(msg);
  }
}

export const getHelpService = (): HelpService => {
  const getHelp = async (entityName: string) => {
    mustAssertHasKey(infoFilesForService, entityName, \`No info document found for entity type: \${entityName}\`)

    const foundDoc = infoFilesForService[entityName];

    return fs.read(foundDoc) as string;
  };

  return {
    getHelp,
  };
};
`

export default helpServiceTmpl
