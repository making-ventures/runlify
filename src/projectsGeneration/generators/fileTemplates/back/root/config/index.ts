import { camelCase } from 'change-case'
import { ProjectWideGenerationArgs } from '../../../../../args'
import { generatedWarning } from '../../../../../utils'

export const configTmpl = ({
  system,
  options,
}: ProjectWideGenerationArgs) => `import {constantCase} from 'change-case';
import nconf from 'nconf';
import {exists, read} from 'fs-jetpack';
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

const developerRunlifyConfig = read('runlify.developer.json', 'json') || 'dev';

const envName = process.env.ENV || developerRunlifyConfig?.defaultEnvironment;
const file = \`./config/\${envName}.json\`;

if (exists(file)) {
  nconf.file({file});
}

export const isLocalEnv = envName === 'local';

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
