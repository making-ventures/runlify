import {expect} from 'jest-without-globals'
import {genGraphSchemesByLocalGenerator} from './genGraphSchemesByLocalGenerator'

describe('genGraphSchemesByLocalGenerator', () => {
  it('does not fail when the command exits 0 but writes to stderr', async () => {
    await expect(
      genGraphSchemesByLocalGenerator({
        graphGeneratorCommand: 'node -e "console.error(\'benign warning\'); process.exit(0)"',
        detachedBackProject: __dirname,
        detachedUiProject: __dirname,
        genFrontend: false,
      } as never),
    ).resolves.toBeUndefined()
  })

  it('still fails when the command exits non-zero', async () => {
    await expect(
      genGraphSchemesByLocalGenerator({
        graphGeneratorCommand: 'node -e "process.exit(1)"',
        detachedBackProject: __dirname,
        detachedUiProject: __dirname,
        genFrontend: false,
      } as never),
    ).rejects.toThrow()
  })
})
