import {expect} from 'jest-without-globals'
import {
  extraDbMigrationEnvVar,
  genExtraDbDeployPrismaConfig,
  genExtraDbPrismaConfig,
  genMainDeployPrismaConfig,
  genMainPrismaConfig,
} from './genPrismaConfig'

describe('genPrismaConfig', () => {
  it('generates main prisma.config.ts', () => {
    const result = genMainPrismaConfig()
    expect(result).toContain("schema: 'schema.prisma'")
    expect(result).toContain("DATABASE_MAIN_MIGRATION_URI")
    expect(result).toContain('postgresql://postgres:password@localhost:5432/postgres')
  })

  it('generates main deploy.prisma.config.ts', () => {
    const result = genMainDeployPrismaConfig()
    expect(result).toContain("schema: 'deployConnection.prisma'")
    expect(result).toContain("DATABASE_MAIN_MIGRATION_URI")
  })

  it('generates extra DB config with correct env var', () => {
    const result = genExtraDbPrismaConfig('bsDocuments')
    expect(result).toContain(`process.env['${extraDbMigrationEnvVar('bsDocuments')}']`)
    expect(result).toContain('postgresql://postgres:password@localhost:5432/bs_documents')
  })

  it('generates extra DB deploy config', () => {
    const result = genExtraDbDeployPrismaConfig('bsDocuments')
    expect(result).toContain("schema: 'deployConnection.prisma'")
    expect(result).toContain(`DATABASE_BS_DOCUMENTS_MIGRATION_URI`)
  })
})
