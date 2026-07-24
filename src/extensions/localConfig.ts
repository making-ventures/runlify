import {existsSync} from 'fs'
import {dirname, join, resolve} from 'path'
import {GluegunToolbox} from 'gluegun'

const findConfigUp = (cwd: string, filename: string): string | null => {
  let dir = resolve(cwd)

  for (;;) {
    const candidate = join(dir, filename)
    if (existsSync(candidate)) {
      return candidate
    }

    const parent = dirname(dir)
    if (parent === dir) {
      return null
    }
    dir = parent
  }
}

const setupLocalConfig = async (toolbox: GluegunToolbox) => {
  const getConfig = () => {
    const cwd = process.cwd()
    const runlifyConfigPath = findConfigUp(cwd, 'runlify.json')
    const runlifyConfig = runlifyConfigPath
      ? toolbox.filesystem.read(runlifyConfigPath, 'json')
      : undefined
    const developerRunlifyConfig = toolbox.filesystem.read(
      './runlify.developer.json',
      'json'
    )
    // toolbox.print.info(runlifyConfig)
    // toolbox.print.info(developerRunlifyConfig)

    return {
      main: runlifyConfig,
      developer: developerRunlifyConfig,
    }
  }

  toolbox.localConfig = {
    getConfig,
  }
}

module.exports = setupLocalConfig
module.exports.findConfigUp = findConfigUp
