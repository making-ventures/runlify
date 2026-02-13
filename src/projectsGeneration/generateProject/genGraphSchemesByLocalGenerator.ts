import * as path from 'path'
import fs from 'fs-extra'
import {exec} from 'child_process'
import {BootstrapEntityInnerOptions} from '../types'
import log from '../../log'

export const genGraphSchemesByLocalGenerator = async (
  options: BootstrapEntityInnerOptions
) => {
  // yarn ts-node src/gen/genGQSchemes.ts

  log.info(`detachedBackProject: ${options.detachedBackProject}`);
  log.info(`detachedUiProject: ${options.detachedUiProject}`);

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

  await new Promise((resolve, reject) =>
    exec(command,
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

  if (options.genFrontend) {
    await fs.copyFile(
      path.join(options.detachedBackProject, 'src', 'generated', 'graphql.ts'),
      path.join(options.detachedUiProject, 'src', 'generated', 'graphql.ts')
    )

    await fs.copyFile(
      path.join(
        options.detachedBackProject,
        'src',
        'generated',
        'graphql.schema.json'
      ),
      path.join(
        options.detachedUiProject,
        'src',
        'generated',
        'graphql.schema.json'
      )
    )
  }
}
