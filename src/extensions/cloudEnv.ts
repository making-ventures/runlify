import { GluegunToolbox } from 'gluegun'
import * as R from 'ramda'
import getAuth from '../utils/getAuth'

module.exports = async (toolbox: GluegunToolbox) => {
  const { removeToken } = getAuth(toolbox)
  const {
    print: { info, error, warning },
  } = toolbox

  const getEnvVariables = async (
    projectId: string,
    environmentId: string,
    scopes: string[]
  ) => {
    const token = toolbox.globalConfig.getConfigValue('token')
    info(`token: ${token}`)

    if (!token) {
      warning(`
You should login first:

    runlify login
`)
      process.exit()
    }

    const endpoint = 'http://localhost:3000'
    const http = await toolbox.http.create({ baseURL: endpoint })
    const res = await http.get<any>(
      `/rest/cli/environmentVariables`,
      {
        projectId,
        environmentId,
        scopes,
      },
      {
        headers: {
          authorization: token,
        },
      }
    )
    if (res.status === 401) {
      removeToken()
      error('Unauthorized')
      process.exit()
    }

    const composedVariables = R.fromPairs(
      res.data.data.map((v) => [v.environmentVariableId, v.value])
    )

    return composedVariables
  }

  const getAvailableEnvironments = async (projectId: string) => {
    const token = toolbox.globalConfig.getConfigValue('token')
    info(`token: ${token}`)

    if (!token) {
      warning(`
You should login first:

    runlify login
`)
      process.exit()
    }

    const endpoint = 'http://localhost:3000'
    const http = await toolbox.http.create({ baseURL: endpoint })
    const res = await http.get<any>(
      `/rest/cli/environments`,
      {
        projectId,
      },
      {
        headers: {
          authorization: token,
        },
      }
    )
    if (res.status === 401) {
      removeToken()
      error('Unauthorized')
      process.exit()
    }

    return res.data.data
  }

  toolbox.cloudEnv = {
    getEnvVariables,
    getAvailableEnvironments,
  }
}
