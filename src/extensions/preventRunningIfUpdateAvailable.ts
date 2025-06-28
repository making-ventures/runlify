import {GluegunToolbox} from 'gluegun'

module.exports = async (toolbox: GluegunToolbox) => {
  toolbox.print.info(`version: ${toolbox.meta.version()}`)

  const res = await toolbox.meta.checkForUpdate()
  if (res) {
    const pathEnv = process.env.PATH
    toolbox.print.info(`pathEnv: ${pathEnv}`)

    const yarnBin = await toolbox.system.exec('yarn global bin')

    const hasYarnBinInPath = pathEnv?.includes(yarnBin)
    toolbox.print.info(`hasYarnBinInPath: ${hasYarnBinInPath}`)

    toolbox.print.warning(`
A new version of \`runlify\` is available!
You can update by running: ${
      toolbox.packageManager.hasYarn() && hasYarnBinInPath
        ? 'yarn global add runlify'
        : `npm install --global runlify`
    } if you use global \`runlify\` or yarn add -D runlify@latest if you run command specified in package.json
`)
    process.exit()
  }
}
