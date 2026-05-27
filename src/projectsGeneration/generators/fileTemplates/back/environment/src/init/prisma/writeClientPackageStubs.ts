import {ProjectWideGenerationArgs} from '../../../../../args'

export const writeClientPackageStubsTmpl = (args: ProjectWideGenerationArgs): string => {
  const extraDbs = args.system.dataBases
    .map((d) => d.name)
    .filter((d) => d !== 'main')

  return `import {existsSync, writeFileSync} from 'node:fs';
import {join} from 'node:path';

const extraDatabases = ${JSON.stringify(extraDbs)};

const writeStub = (dir: string, packageName: string): void => {
  const clientTs = join(dir, 'client.ts');
  if (!existsSync(clientTs)) {
    return;
  }
  writeFileSync(
    join(dir, 'package.json'),
    JSON.stringify({name: packageName, types: './client.ts'}) + '\\n',
  );
};

const shardsOnly = process.argv.includes('--shards-only');

if (shardsOnly) {
  writeStub('prisma/shards/build', '@prisma/shards/build');
} else {
  for (const db of extraDatabases) {
    writeStub(
      join('prisma', 'databases', db, 'client'),
      \`@prisma/\${db}/client\`,
    );
  }
}
`
}
