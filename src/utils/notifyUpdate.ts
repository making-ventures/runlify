import * as checkForUpdate from 'update-check'
import * as packageJson from '../../package.json'
import getPkgManager from './getPkgManager'

// based on function from runlify package

const update = (checkForUpdate as any)(packageJson).catch(() => null)

const notifyUpdate = async (): Promise<void> => {
  try {
    const res = await update
    if (res?.latest) {
      const pkgManager = getPkgManager()
      console.log(`
A new version of \`runlify\` is available!
You can update by running: ${
        pkgManager === 'yarn'
          ? 'yarn global add runlify'
          : `${pkgManager} install --global runlify`
      }
`)
      process.exit()
    }
  } catch {
    // ignore error
  }
}

export default notifyUpdate
