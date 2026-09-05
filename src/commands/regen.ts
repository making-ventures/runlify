import {GluegunToolbox} from 'gluegun'
import {BootstrapEntityOptions, generateProject, System} from '../projectsGeneration'
import {
  resolveMetaPaths,
  resolveProjectPaths,
} from '../projectsGeneration/resolveProjectPaths'
import {existsSync, readFileSync} from 'fs'

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
    const {parameters} = toolbox

    const backOnly = parameters.options.backOnly || parameters.options['back-only']

    const runlifyConfig = toolbox.localConfig.getConfig().main ?? null
    const cwd = process.cwd()

    const metaLoc = resolveMetaPaths(cwd, runlifyConfig)

    if (!existsSync(metaLoc.metadataJsonPath)) {
      throw new Error(`Cannot find metadata.json at ${metaLoc.metadataJsonPath}`)
    }
    if (!existsSync(metaLoc.optionsJsonPath)) {
      throw new Error(`Cannot find options.json at ${metaLoc.optionsJsonPath}`)
    }

    const metaJson = readFileSync(metaLoc.metadataJsonPath, 'utf8')
    const optionsJson = readFileSync(metaLoc.optionsJsonPath, 'utf8')

    const meta = JSON.parse(metaJson) as System; // TODO парсить валидатором в заданную структуру
    const options = JSON.parse(optionsJson) as BootstrapEntityOptions; // TODO парсить валидатором в заданную структуру

    if (backOnly) {
      options.genFrontend = false
    }

    const resolved = resolveProjectPaths({
      cwd,
      runlifyConfig,
      options: options as BootstrapEntityOptions & Record<string, unknown>,
    })

    Object.assign(options, {
      detachedBackProject: resolved.detachedBackProject,
      detachedUiProject: resolved.detachedUiProject,
      detachedSharedProject: resolved.detachedSharedProject,
      metaDir: resolved.metaDir,
      sharedSchemaPath: resolved.sharedSchemaPath,
      copySchemaToUi: resolved.copySchemaToUi,
      layoutMode: resolved.layoutMode,
      repoRoot: resolved.repoRoot,
      prismaModuleFormatCjs: resolved.prismaModuleFormatCjs,
    })

    // const validateMeta = (system: System): ValidationMessage[] => {
    //   return [
    //     // {
    //     //   level: ValidationLevel.Error,
    //     //   message: 'Some validation error'
    //     // },
    //     // {
    //     //   level: ValidationLevel.Warning,
    //     //   message: 'Some validation warning'
    //     // },
    //   ];
    // }

    // const validationMessages = validateMeta(meta);
    // const validationWarinigs = validationMessages.filter(({level}) => level === ValidationLevel.Warning);
    // validationWarinigs.forEach(m => log.warn(m.message));
    // const validationErrors = validationMessages.filter(({level}) => level === ValidationLevel.Error);
    // validationErrors.forEach(m => log.error(m.message));

    // if (validationErrors.length) {
    //   throw new Error(`Metadata has ${validationWarinigs.length} warnings and ${validationErrors.length} errors`)
    // }

    generateProject(meta, options);
  },
}
