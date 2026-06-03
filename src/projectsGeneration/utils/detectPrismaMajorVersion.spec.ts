import {mkdirSync, writeFileSync} from 'fs'
import {join} from 'path'
import {tmpdir} from 'os'
import {remove} from 'fs-jetpack'
import {detectPrismaMajorVersion} from './detectPrismaMajorVersion'

const mkPkg = (deps: Record<string, string>): string => {
  const dir = join(tmpdir(), `runlify-prisma-detect-${Date.now()}-${Math.random()}`)
  mkdirSync(dir, {recursive: true})
  writeFileSync(
    join(dir, 'package.json'),
    JSON.stringify({
      dependencies: deps,
    }),
  )
  return dir
}

describe('detectPrismaMajorVersion', () => {
  const dirs: string[] = []

  afterEach(() => {
    for (const dir of dirs) {
      remove(dir)
    }
    dirs.length = 0
  })

  it('returns 7 for prisma 7.x', () => {
    dirs.push(mkPkg({prisma: '7.8.0', '@prisma/client': '7.8.0'}))
    expect(detectPrismaMajorVersion(dirs[0])).toBe(7)
  })

  it('returns 6 for prisma 6.x', () => {
    dirs.push(mkPkg({prisma: '6.19.0', '@prisma/client': '6.19.0'}))
    expect(detectPrismaMajorVersion(dirs[0])).toBe(6)
  })

  it('prefers prisma CLI over @prisma/client on mismatch', () => {
    dirs.push(mkPkg({prisma: '7.0.0', '@prisma/client': '6.19.0'}))
    expect(detectPrismaMajorVersion(dirs[0])).toBe(7)
  })

  it('falls back to @prisma/client when prisma CLI is absent', () => {
    dirs.push(mkPkg({'@prisma/client': '6.19.0'}))
    expect(detectPrismaMajorVersion(dirs[0])).toBe(6)
  })

  it('returns legacy default when no prisma packages found', () => {
    dirs.push(mkPkg({lodash: '4.17.21'}))
    expect(detectPrismaMajorVersion(dirs[0])).toBe(6)
  })

  it('returns legacy default when package.json is missing', () => {
    const dir = join(tmpdir(), `runlify-prisma-detect-missing-${Date.now()}`)
    mkdirSync(dir, {recursive: true})
    dirs.push(dir)
    expect(detectPrismaMajorVersion(dir)).toBe(6)
  })
})
