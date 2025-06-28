import {GluegunToolbox} from 'gluegun'

module.exports = {
  name: 'logout',
  alias: ['o'],
  run: async (toolbox: GluegunToolbox) => {
    const { logout } = toolbox.auth

    await logout()
  },
}
