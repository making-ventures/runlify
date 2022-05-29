import { GluegunToolbox } from 'gluegun'

module.exports = {
  name: 'login',
  alias: ['l'],
  run: async (toolbox: GluegunToolbox) => {
    const { login } = toolbox.auth

    await login()
  },
}
