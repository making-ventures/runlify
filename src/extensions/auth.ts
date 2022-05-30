import { GluegunToolbox } from 'gluegun'

module.exports = async (toolbox: GluegunToolbox) => {
  const {
    print: { info, error },
  } = toolbox
  const endpoint = 'https://prj-ep.prod.apps.stage01.making.ventures'

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

    if (!res.ok) {
      error(`Error. Status: ${res.status}`)
      error(res.data)
      process.exit()
    }

    const tokenEntity = res.data.data

    info('tokenEntity')
    info(tokenEntity)

    toolbox.globalConfig.setConfigValue('token', tokenEntity.token)
  }

  const logout = async () => {
    const token = toolbox.globalConfig.getConfigValue('token')

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
    toolbox.globalConfig.setConfigValue('token', undefined)
  }

  toolbox.auth = {
    login,
    logout,
    removeToken,
  }
}
