import { GluegunToolbox } from 'gluegun'
import getGlobalConfigService from '../services/getGlobalConfigService'

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
const getAuth = (toolbox: GluegunToolbox) => {
  const { setConfigValue, getConfigValue } = getGlobalConfigService(toolbox)
  const {
    print: { info, error },
  } = toolbox

  const login = async () => {
    const { login } = await toolbox.prompt.ask({
      name: 'login',
      type: 'input',
      message: 'login',
    })
    info(login)

    const { password } = await toolbox.prompt.ask({
      name: 'password',
      type: 'password',
      message: 'password',
    })
    info(password)

    const endpoint = 'http://localhost:3000'
    info(endpoint)

    const http = await toolbox.http.create({ baseURL: endpoint })
    const res = await http.post<any>('/rest/cli/login', {
      login,
      password,
      name: 'runlify',
    })

    if (res.status === 401) {
      error(
        'Wrong login, password or you do not have permission to login by cli'
      )
      process.exit()
    }

    const tokenEntity = res.data.data

    info('tokenEntity')
    info(tokenEntity)

    setConfigValue('token', tokenEntity.token)
  }

  const logout = async () => {
    const token = getConfigValue('token')
    info(`token: ${token}`)

    const endpoint = 'http://localhost:3000'
    const http = await toolbox.http.create({ baseURL: endpoint })
    const res = await http.post<any>(
      '/rest/cli/logout',
      {},
      {
        headers: {
          authorization: token,
        },
      }
    )
    info(res)

    removeToken()
  }

  const removeToken = () => {
    setConfigValue('token', undefined)
  }

  return {
    login,
    logout,
    removeToken,
  }
}

export default getAuth
