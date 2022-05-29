import { GluegunToolbox } from 'gluegun'
import getAppDataPath from 'appdata-path'

module.exports = async (toolbox: GluegunToolbox) => {
  const getConfigPath = () => getAppDataPath('runlify/runlify.json')

  const writeConfig = (config: Record<string, any>) => {
    const configPath = getConfigPath()

    return toolbox.filesystem.write(configPath, JSON.stringify(config))
  }

  const initConfig = () => {
    const configPath = getConfigPath()

    if (!toolbox.filesystem.exists(configPath)) {
      toolbox.filesystem.write(configPath, JSON.stringify({}))
    }
  }

  const getConfig = () => {
    initConfig()
    const configPath = getConfigPath()
    const rawConfig = toolbox.filesystem.read(configPath)

    return JSON.parse(rawConfig)
  }

  const setConfigValue = (key: string, value: string) => {
    const config = getConfig()

    writeConfig({
      ...config,
      [key]: value,
    })
  }

  const getConfigValue = (key: string) => {
    const config = getConfig()

    return config[key]
  }

  toolbox.globalConfig = {
    getConfigPath,
    writeConfig,
    initConfig,
    getConfig,
    setConfigValue,
    getConfigValue,
  }
}
