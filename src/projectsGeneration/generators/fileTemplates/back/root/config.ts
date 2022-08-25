import { camelCase } from 'change-case'
import { ProjectWideGenerationArgs } from '../../../../args'
import { generatedWarning } from '../../../../utils'

export const configTmpl = ({
  system,
  options,
}: ProjectWideGenerationArgs) => `import {constantCase} from 'change-case';
import nconf from 'nconf';
${
  options.skipWarningThisIsGenerated
    ? ''
    : `
// ${generatedWarning}`
}

nconf
  .argv()
  .env()
  .file({file: './config/default.json'});

export const getFromNconf = (name: string): string | undefined => nconf.get(constantCase(name)) || nconf.get(name) || '';

const envConfig = {
  ${system.configVars
    .filter((v) => v.scopes.includes('back'))
    .map((v) => `${camelCase(v.name)}: getFromNconf('${v.name}'),`).join(`
  `)}
};

export type Config = typeof envConfig;

export const getConfig = async (): Promise<Config> => envConfig;
`
