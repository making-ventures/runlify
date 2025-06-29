import {GluegunToolbox} from 'gluegun'
import {generateProject, System} from '../projectsGeneration';
import log from '../log';

export enum ValidationLevel {
  Error = 'error',
  Warning = 'warning',
}
interface ValidationMessageBase {
  message: string;
}
export interface ValidationError extends ValidationMessageBase {
  level: ValidationLevel.Error;
}
export interface ValidationWarning extends ValidationMessageBase {
  level: ValidationLevel.Warning;
}

export type ValidationMessage = ValidationError | ValidationWarning;

module.exports = {
  name: 'regenerate',
  alias: ['regen'],
  run: async (toolbox: GluegunToolbox) => {
    const {filesystem} = toolbox


    const metaPath = 'src/meta/metadata.json';
    const optionsPath = 'src/meta/options.json';

    const metaJson = filesystem.read(metaPath) || '{}';
    const optionsJson = filesystem.read(optionsPath) || '{}';

    const meta = JSON.parse(metaJson);
    const options = JSON.parse(optionsJson);

    const validateMeta = (system: System): ValidationMessage[] => {
      return [
        // {
        //   level: ValidationLevel.Error,
        //   message: 'Some validation error'
        // },
        // {
        //   level: ValidationLevel.Warning,
        //   message: 'Some validation warning'
        // },
      ];
    }

    const validationMessages = validateMeta(meta);
    const validationWarinigs = validationMessages.filter(({level}) => level === ValidationLevel.Warning);
    validationWarinigs.forEach(m => log.warn(m.message));
    const validationErrors = validationMessages.filter(({level}) => level === ValidationLevel.Error);
    validationErrors.forEach(m => log.error(m.message));

    if (validationErrors.length) {
      throw new Error(`Metadata has ${validationWarinigs.length} warnings and ${validationErrors.length} errors`)
    }

    generateProject(meta, options);
  },
}
