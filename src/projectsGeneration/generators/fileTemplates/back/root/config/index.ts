import { camelCase } from 'change-case'
import { FieldType } from '../../../../../../types'
import { ProjectWideGenerationArgs } from '../../../../../args'
import { generatedWarning } from '../../../../../utils'

const getUtilGetterForType = (type: FieldType) => {
  switch (type) {
    case 'string':
      return 'getStringConfig';
    case 'int':
      return 'getIntConfig';
    case 'bigint':
      return 'getBigIntConfig';
    case 'float':
      return 'getFloatConfig';
    case 'bool':
      return 'getBooleanConfig';
    case 'datetime':
      return 'getDateTimeConfig';
    case 'date':
      return 'getDateConfig';
    default:
      throw new Error(`Unknown ""${type} type`)
  }
}

export const configTmpl = ({
  system,
  options,
}: ProjectWideGenerationArgs) => `/* eslint-disable max-len */
import {constantCase} from 'change-case';
import nconf from 'nconf';
import {exists, read} from 'fs-jetpack';
import getConfigUtils from './getConfigUtils';
import {ValueBasedOnRequired} from './types';
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

export const getFromNconf = <T extends boolean>(name: string, required?: T): ValueBasedOnRequired<T, string> => {
  const value = nconf.get(constantCase(name)) || nconf.get(name);

  if (required && value === undefined) {
    throw new Error(\`Config var "\${name}" is required\`);
  }

  return value;
};

const utils = getConfigUtils(getFromNconf);

const envConfig = {
  ${system.configVars
    .filter((v) => v.scopes.includes('back'))
    .map((v) => `${camelCase(v.name)}: utils.${getUtilGetterForType(v.type)}('${v.name}', ${v.required}),`).join(`
  `)}
};

export type Config = typeof envConfig;

export const getConfig = async (): Promise<Config> => envConfig;
`
