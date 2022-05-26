import * as checkForUpdate from 'update-check'
import * as packageJson from '../../package.json'
import getPkgManager from './getPkgManager'

// based on function from create-next-app package

const update = (checkForUpdate as any)(packageJson).catch(() => null)

const notifyUpdate = async (): Promise<void> => {
  try {
    const res = await update
    if (res?.latest) {
      const pkgManager = getPkgManager()
      console.log(`
A new version of \`create-next-app\` is available!
You can update by running: ${
        pkgManager === 'yarn'
          ? 'yarn global add create-next-app'
          : `${pkgManager} install --global create-next-app`
      }
`)
      process.exit()
    }
  } catch {
    // ignore error
  }
}

export default notifyUpdate
