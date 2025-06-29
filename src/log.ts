import * as winston from 'winston'

const log = winston.createLogger({
  defaultMeta: {
    loggerName: 'runlify',
  },
  format: winston.format.combine(
    winston.format.colorize(),
    winston.format.errors({ stack: true }),
    winston.format.cli(),
    winston.format.printf((context) => {
      const msgstr = JSON.stringify(context.message, null, '\t')
      return `[${context.level}]${msgstr}`
    })
  ),
  transports: [new winston.transports.Console()],
})

export default log
