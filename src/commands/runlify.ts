import { GluegunCommand } from 'gluegun'

const command: GluegunCommand = {
  name: 'runlify',
  run: async (toolbox) => {
    const { print } = toolbox

    print.info('Welcome to runlify CLI')
  },
}

module.exports = command
