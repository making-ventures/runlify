import { GluegunToolbox } from 'gluegun'
import * as R from 'ramda'

module.exports = async (toolbox: GluegunToolbox) => {
  const { removeToken } = toolbox.auth
  const {
    print: { info, error, warning },
  } = toolbox
  const endpoint = 'https://prj-ep.prod.apps.stage01.making.ventures'

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

    if (!res.ok) {
      error(`Error. Status: ${res.status}`)
      error(res.data)
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

    if (!res.ok) {
      error(`Error. Status: ${res.status}`)
      error(res.data)
      process.exit()
    }

    console.log(res)

    return res.data.data
  }

  toolbox.cloudEnv = {
    getEnvVariables,
    getAvailableEnvironments,
  }
}
