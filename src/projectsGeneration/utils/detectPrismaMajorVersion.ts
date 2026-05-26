import {readFileSync} from 'fs'
import {join} from 'path'
import log from '../../log'

const parseMajor = (version: string): number | null => {
  const match = /^(\d+)/u.exec(version.trim())
  return match ? Number.parseInt(match[1], 10) : null
}

const readPackageJson = (projectRoot: string): Record<string, unknown> | null => {
  try {
    const raw = readFileSync(join(projectRoot, 'package.json'), 'utf8')
    return JSON.parse(raw) as Record<string, unknown>
  } catch {
    return null
  }
}

const getDepVersion = (
  pkg: Record<string, unknown>,
  name: string,
): string | undefined => {
  for (const section of ['dependencies', 'devDependencies'] as const) {
    const deps = pkg[section] as Record<string, string> | undefined
    const version = deps?.[name]
    if (version) {
      return version.replace(/^[\^~>=<]+/u, '')
    }
  }
  return undefined
}

export const detectPrismaMajorVersion = (projectRoot: string): number => {
  const pkg = readPackageJson(projectRoot)
  if (!pkg) {
    log.warn('detectPrismaMajorVersion: package.json not found, using legacy Prisma mode')
    return 6
  }

  const cliVersion = getDepVersion(pkg, 'prisma')
  const clientVersion = getDepVersion(pkg, '@prisma/client')

  if (!cliVersion && !clientVersion) {
    log.warn(
      'detectPrismaMajorVersion: neither prisma nor @prisma/client found in package.json, using legacy Prisma mode',
    )
    return 6
  }

  const cliMajor = cliVersion ? parseMajor(cliVersion) : null
  const clientMajor = clientVersion ? parseMajor(clientVersion) : null

  if (cliMajor !== null && clientMajor !== null && cliMajor !== clientMajor) {
    log.warn(
      `detectPrismaMajorVersion: prisma (${cliVersion}) and @prisma/client (${clientVersion}) differ in major version; using prisma CLI major ${cliMajor}`,
    )
  }

  if (cliMajor !== null) {
    return cliMajor
  }

  if (clientMajor !== null) {
    return clientMajor
  }

  log.warn('detectPrismaMajorVersion: could not parse Prisma version, using legacy Prisma mode')
  return 6
}

export const isPrisma7OrLater = (projectRoot: string): boolean =>
  detectPrismaMajorVersion(projectRoot) >= 7
