import { GluegunToolbox } from 'gluegun'

module.exports = {
  name: 'login',
  alias: ['l'],
  run: async (toolbox: GluegunToolbox) => {
    const {
      parameters,
      auth: {login}
    } = toolbox;

    await login({
      ifNotLeggedin: parameters.options.ifNotLeggedin,
    })
  },
}
