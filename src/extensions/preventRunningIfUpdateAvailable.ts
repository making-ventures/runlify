import { GluegunToolbox } from 'gluegun'

module.exports = async (toolbox: GluegunToolbox) => {
  toolbox.foo = () => {
    toolbox.print.info('called foo extension')
  }

  const res = await toolbox.meta.checkForUpdate()
  if (res) {
    toolbox.print.warning(`
A new version of \`runlify\` is available!
You can update by running: ${
      // toolbox.packageManager.hasYarn()
      //   ? 'yarn global add runlify'
      //   :
      `npm install --global runlify`
    }
`)
    process.exit()
  }
}
