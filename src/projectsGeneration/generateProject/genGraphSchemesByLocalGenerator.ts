import * as path from 'path'
import fs from 'fs-extra'
import {exec} from 'child_process'
import {BootstrapEntityOptions} from '../types'
import log from '../../log'
import {
  GenerationPathCategory,
  GenerationPathsConfig,
  resolveGenerationPath,
} from '../builders/generationPaths'

const resolvePath = (
  options: BootstrapEntityOptions,
  category: GenerationPathCategory,
) =>
  resolveGenerationPath({
    category,
    detachedBackProject: options.detachedBackProject,
    detachedUiProject: options.detachedUiProject,
    pathsConfig: (options as BootstrapEntityOptions & {
      generationPaths?: GenerationPathsConfig
    }).generationPaths,
    vars: {},
  })

export const genGraphSchemesByLocalGenerator = async (
  options: BootstrapEntityOptions
) => {
  // yarn ts-node src/gen/genGQSchemes.ts

  log.info(`detachedBackProject: ${options.detachedBackProject}`);
  log.info(`detachedUiProject: ${options.detachedUiProject}`);
  log.info(`layoutMode: ${(options as BootstrapEntityOptions & {layoutMode?: string}).layoutMode ?? 'legacy'}`);

  let command = options.graphGeneratorCommand

  if (!command) {
    command = `yarn ts-node ${path.join(
      options.detachedBackProject,
      'src',
      'gen',
      'genGQSchemes.ts'
    )}`;
  }
  log.info(`command: ${command}`);

  const execCwd = options.detachedBackProject

  await new Promise((resolve, reject) =>
    exec(command,
      {cwd: execCwd},
      (error, _stdout, stderr) => {
        if (error) {
          log.error(`error: ${error.message}`)
          reject(new Error(`error: ${error.message}`))

          return
        }

        if (stderr) {
          log.error(`stderr: ${stderr}`)
          reject(new Error(`stderr: ${stderr}`))

          return
        }

        resolve(undefined)
      }
    )
  )

  const schemaJsonSrc = resolvePath(
    options,
    GenerationPathCategory.BackGeneratedGraphqlSchemaJson,
  )
  const backGraphqlTs = resolvePath(
    options,
    GenerationPathCategory.BackGeneratedGraphqlTs,
  )

  const opts = options as BootstrapEntityOptions & {
    sharedSchemaPath?: string
    copySchemaToUi?: boolean
    generationPaths?: GenerationPathsConfig
    detachedSharedProject?: string
  }

  if (options.genFrontend && opts.copySchemaToUi !== false) {
    await fs.copyFile(
      backGraphqlTs,
      resolvePath(options, GenerationPathCategory.UiGeneratedGraphqlTs),
    )

    await fs.copyFile(
      schemaJsonSrc,
      resolvePath(options, GenerationPathCategory.UiGeneratedGraphqlSchemaJson),
    )
  }

  if (opts.sharedSchemaPath) {
    await fs.ensureDir(path.dirname(opts.sharedSchemaPath))
    await fs.copyFile(schemaJsonSrc, opts.sharedSchemaPath)
  } else if (opts.detachedSharedProject) {
    const sharedSchema = resolveGenerationPath({
      category: GenerationPathCategory.SharedGraphqlSchemaJson,
      detachedBackProject: options.detachedBackProject,
      detachedUiProject: options.detachedUiProject,
      detachedSharedProject: opts.detachedSharedProject,
      pathsConfig: opts.generationPaths,
      vars: {},
    })
    await fs.ensureDir(path.dirname(sharedSchema))
    await fs.copyFile(schemaJsonSrc, sharedSchema)
  }
}
