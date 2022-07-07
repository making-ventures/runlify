import SystemMetaBuilder from '../builders/SystemMetaBuilder';

const addCommonCommands = (system: SystemMetaBuilder) => {
  system.addCommnad(
    'back',
    'build',
    '(rm -rf dist || true) && tsc',
    'Сборки проекта',
  );
  system.addCommnad(
    'back',
    'start',
    'runlify start env=prod node --unhandled-rejections=strict dist/index.js',
    'Запуска собранного проекта',
  );
  system.addCommnad(
    'back',
    'dev',
    'ts-node-dev --files src/index.ts',
    'Запуска преокта в режиме разработки',
  );
  system.addCommnad(
    'back',
    'dev:stage',
    'runlify start yarn dev',
    'Запуска преокта в режиме разработки с использование stage базы данных',
  );
  system.addCommnad(
    'back',
    'lint',
    'eslint ./src/**.ts',
    'Проверки проекта линтером',
  );
  system.addCommnad(
    'back',
    'gen',
    'graphql-codegen --config codegen.yml',
    'Генерации typescript-типов на основе graphql-типов',
  );
  system.addCommnad(
    'back',
    'test',
    'jest --maxWorkers 8',
    'Запуска тестов',
  );
  system.addCommnad(
    'back',
    'prisma:gen',
    'prisma generate',
    'Генерации prisma-клиента',
  );
  system.addCommnad(
    'back',
    'prisma:migrate',
    'runlify start env=migration prisma migrate dev --preview-feature',
    'Создания новой миграции базы данных',
  );
  system.addCommnad(
    'back',
    'prisma:deploy',
    'prisma migrate deploy --preview-feature',
    'Мигрирования базы данных',
  );
  system.addCommnad(
    'back',
    'prisma',
    'prisma',
    'Запуска cli призмы из зависимостей проекта',
  );
  system.addCommnad(
    'back',
    'ts-node:withContext',
    'yarn ts-node ./src/init/wrap.ts',
    'Запуска typescript скрипта, требующего для работы контекст',
  );
  system.addCommnad(
    'back',
    'init',
    'yarn ts-node src/init/baseInit.ts',
    'Инициализации базы данных',
  );
  system.addCommnad(
    'back',
    'init:permissions',
    'yarn ts-node:withContext src/init/permissions/initPermissions.ts',
    'Инициализации системы ролевой модели',
  );
  system.addCommnad(
    'back',
    'init:dev',
    'yarn ts-node src/init/initDev.ts',
    'Инициализации базы данных для разработчика или тестировщика',
  );
};

export default addCommonCommands;
