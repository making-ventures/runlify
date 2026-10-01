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

type GraphSchemesOptions = BootstrapEntityOptions & {
  sharedSchemaPath?: string
  copySchemaToUi?: boolean
  copyGraphqlTsToUi?: boolean
  generationPaths?: GenerationPathsConfig
  detachedSharedProject?: string
}

const resolvePath = (
  options: GraphSchemesOptions,
  category: GenerationPathCategory,
) =>
  resolveGenerationPath({
    category,
    detachedBackProject: options.detachedBackProject,
    detachedUiProject: options.detachedUiProject,
    pathsConfig: options.generationPaths,
    vars: {},
  })

export const genGraphSchemesByLocalGenerator = async (
  options: GraphSchemesOptions,
) => {
  // yarn ts-node src/gen/genGQSchemes.ts

  log.info(`detachedBackProject: ${options.detachedBackProject}`);
  log.info(`detachedUiProject: ${options.detachedUiProject}`);
  log.info(`layoutMode: ${(options as BootstrapEntityOptions & {layoutMode?: string}).layoutMode ?? 'detached'}`);

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

        // Exit code (surfaced as `error` above) is the real success signal — tools like
        // pnpm write benign warnings to stderr even when they exit 0, so don't fail on that.
        if (stderr) {
          log.warn(`stderr: ${stderr}`)
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

  const copySchemaToUi = options.genFrontend && options.copySchemaToUi !== false
  // Unset copyGraphqlTsToUi keeps the old behaviour: one flag for both files.
  const copyGraphqlTsToUi =
    options.genFrontend &&
    (options.copyGraphqlTsToUi ?? options.copySchemaToUi) !== false

  if (copyGraphqlTsToUi) {
    await fs.copyFile(
      backGraphqlTs,
      resolvePath(options, GenerationPathCategory.UiGeneratedGraphqlTs),
    )
  }

  if (copySchemaToUi) {
    await fs.copyFile(
      schemaJsonSrc,
      resolvePath(options, GenerationPathCategory.UiGeneratedGraphqlSchemaJson),
    )
  }

  if (options.sharedSchemaPath) {
    await fs.ensureDir(path.dirname(options.sharedSchemaPath))
    await fs.copyFile(schemaJsonSrc, options.sharedSchemaPath)
  } else if (
    options.detachedSharedProject &&
    options.detachedSharedProject !== options.detachedBackProject
  ) {
    // Only when a real shared package is configured — not the back-root fallback.
    const sharedSchema = resolveGenerationPath({
      category: GenerationPathCategory.SharedGraphqlSchemaJson,
      detachedBackProject: options.detachedBackProject,
      detachedUiProject: options.detachedUiProject,
      detachedSharedProject: options.detachedSharedProject,
      pathsConfig: options.generationPaths,
      vars: {},
    })
    await fs.ensureDir(path.dirname(sharedSchema))
    await fs.copyFile(schemaJsonSrc, sharedSchema)
  }
}
