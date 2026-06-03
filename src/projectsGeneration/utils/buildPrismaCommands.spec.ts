import {
  buildMigrationsListCommand,
  buildPrismaDeployCommand,
  buildPrismaGenCommand,
  buildShardsGenCommand,
} from './buildPrismaCommands'

describe('buildPrismaCommands', () => {
  it('builds legacy P6 prisma:gen with per-db schemas', () => {
    const cmd = buildPrismaGenCommand({
      databaseNames: ['main', 'bsDocuments'],
      sharding: false,
      prismaMajor: 6,
    })
    expect(cmd).toBe(
      'prisma generate --schema prisma/schema.prisma && prisma generate --schema prisma/databases/bsDocuments/schema.prisma',
    )
  })

  it('builds P7 prisma:gen with configs and stubs', () => {
    const cmd = buildPrismaGenCommand({
      databaseNames: ['main', 'bsDocuments'],
      sharding: false,
      prismaMajor: 7,
    })
    expect(cmd).toContain('prisma generate --config prisma/prisma.config.ts')
    expect(cmd).toContain('prisma/databases/bsDocuments/prisma.config.ts')
    expect(cmd).toContain('tsx src/init/prisma/writeClientPackageStubs.ts')
  })

  it('builds legacy shards:gen', () => {
    const cmd = buildShardsGenCommand({
      databaseNames: ['main'],
      sharding: true,
      prismaMajor: 6,
    })
    expect(cmd).toBe('prisma generate --schema prisma/shards/schema.prisma')
  })

  it('builds P7 shards:gen', () => {
    const cmd = buildShardsGenCommand({
      databaseNames: ['main'],
      sharding: true,
      prismaMajor: 7,
    })
    expect(cmd).toContain('prisma/shards/prisma.config.ts')
    expect(cmd).toContain('--shards-only')
  })

  it('builds legacy prisma:deploy chain', () => {
    const cmd = buildPrismaDeployCommand({
      databaseNames: ['main', 'bsDocuments'],
      sharding: false,
      prismaMajor: 6,
    })
    expect(cmd).toContain('--schema=prisma/deployConnection.prisma')
    expect(cmd).toContain('prisma/databases/bsDocuments/deployConnection.prisma')
  })

  it('builds migrations:list for P7', () => {
    const cmd = buildMigrationsListCommand({
      databaseNames: ['main'],
      sharding: false,
      prismaMajor: 7,
    })
    expect(cmd).toBe('prisma migrate status --config prisma/deploy.prisma.config.ts')
  })
})
