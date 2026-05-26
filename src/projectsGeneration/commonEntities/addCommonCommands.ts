import {cwd} from 'process'
import SystemMetaBuilder from '../builders/SystemMetaBuilder'
import {
  buildMigrationsListCommand,
  buildPrismaDeployCommand,
  buildPrismaGenCommand,
  buildPrismaNewMigrationCommand,
  buildShardsGenCommand,
  buildShardsNewMigrationCommand,
} from '../utils/buildPrismaCommands'
import {detectPrismaMajorVersion} from '../utils/detectPrismaMajorVersion'

const addCommonCommands = (system: SystemMetaBuilder) => {
  system.addCommnad(
    'back',
    'build',
    '(rm -rf dist || true) && tsc',
    'Сборки проекта',
  )
  system.addCommnad(
    'back',
    'start',
    'runlify start env=prod node --unhandled-rejections=strict dist/index.js',
    'Запуска собранного проекта',
  )
  system.addCommnad(
    'back',
    'dev',
    'ts-node-dev --files src/index.ts',
    'Запуска преокта в режиме разработки',
  )
  system.addCommnad(
    'back',
    'dev:stage',
    'runlify start env=stage yarn dev',
    'Запуска преокта в режиме разработки с использованием stage окружения',
  )
  system.addCommnad(
    'back',
    'dev:local',
    'runlify start env=local yarn dev',
    'Запуска преокта в режиме разработки с использованием локального окружения',
  )
  system.addCommnad(
    'back',
    'dev:prod',
    'runlify start env=prod yarn dev',
    'Запуска преокта в режиме разработки с использованием prod окружения',
  )
  system.addCommnad(
    'back',
    'lint',
    'eslint ./src/**.ts',
    'Проверки проекта линтером',
  )
  system.addCommnad(
    'back',
    'gen',
    'graphql-codegen --config codegen.yml',
    'Генерации typescript-типов на основе graphql-типов',
  )
  system.addCommnad(
    'back',
    'test',
    'jest --maxWorkers 2',
    'Запуска тестов',
  )

  const prismaMajor = detectPrismaMajorVersion(cwd())
  const prismaCommandOpts = {
    databaseNames: system.getRegisteredDatabaseNames(),
    sharding: system.defOpts.sharding,
    prismaMajor,
  }

  system.addCommnad(
    'back',
    'prisma:gen',
    buildPrismaGenCommand(prismaCommandOpts),
    'Генерации prisma-клиента',
  )
  system.addCommnad(
    'back',
    'prisma:newMigration',
    buildPrismaNewMigrationCommand(prismaCommandOpts),
    'Создания новой миграции базы данных',
  )
  system.addCommnad(
    'back',
    'prisma:deploy',
    buildPrismaDeployCommand(prismaCommandOpts),
    'Мигрирования базы данных',
  )
  system.addCommnad(
    'back',
    'migrations:list',
    buildMigrationsListCommand(prismaCommandOpts),
    'Статус миграций основной базы данных',
  )
  system.addCommnad(
    'back',
    'prisma',
    'prisma',
    'Запуска cli призмы из зависимостей проекта',
  )

  const shardsGen = buildShardsGenCommand(prismaCommandOpts)
  if (shardsGen) {
    system.addCommnad(
      'back',
      'shards:gen',
      shardsGen,
      'Генерации prisma-клиента шардов',
    )
  }

  const shardsNewMigration = buildShardsNewMigrationCommand(prismaCommandOpts)
  if (shardsNewMigration) {
    system.addCommnad(
      'back',
      'shards:newMigration',
      shardsNewMigration,
      'Создания новой миграции шардов',
    )
  }

  system.addCommnad(
    'back',
    'ts-node:withContext',
    'yarn ts-node ./src/init/wrap.ts',
    'Запуска typescript скрипта, требующего для работы контекст',
  )
  system.addCommnad(
    'back',
    'init:base',
    'yarn ts-node src/init/baseInit.ts',
    'Инициализации базы данных',
  )
  system.addCommnad(
    'back',
    'init:permissions',
    'yarn ts-node:withContext src/init/roles/initRoles.ts',
    'Инициализации системы ролевой модели',
  )
  system.addCommnad(
    'back',
    'init:dev',
    'yarn ts-node src/init/initDev.ts',
    'Инициализации базы данных для разработчика или тестировщика',
  )
}

export default addCommonCommands
