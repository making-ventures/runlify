import {camelCase} from 'change-case'

import {ProjectWideGenerationArgs} from '../../../../../args'
import {FieldType} from '../../../../../../types'

const getTSTypeForEnvVar = (type: FieldType) => {
  switch (type) {
    case 'string':
      return 'string';
    case 'int':
    case 'float':
      return 'number';
    case 'bigint':
      return 'bigint';
    case 'bool':
      return 'boolean';
    case 'datetime':
    case 'date':
      return 'Date';
    default:
      throw new Error(`Unknown ""${type} type`)
  }
}

export const configItemsTmpl = ({
  system,
}: ProjectWideGenerationArgs) => 
`import {EnvVarConfig} from './types';

export interface Config {
  env: string;
  ${system.configVars
    .filter((v) => v.scopes.includes('back'))
    .map((v) => `${camelCase(v.name)}${v.required ? '' : '?'}: ${getTSTypeForEnvVar(v.type)};`).join('\n  ')}
}

export const envVarsConfig: EnvVarConfig[] = [{${system.configVars
  .filter((v) => v.scopes.includes('back'))
  .map((v) => `
  id: '${v.name}',
  type: '${v.type}',
  title: '${v.needFor}',
  required: ${v.required},
  hidden: ${v.hidden},
  editable: ${v.editable},`)
  .join('\n}, {')}
}];
`
