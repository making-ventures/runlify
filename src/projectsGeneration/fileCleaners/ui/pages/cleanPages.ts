import {dirname, join, relative} from "path";
import {ProjectWideGenerationArgs} from "../../../args";
import {existsSync, readdirSync, readFileSync, statSync} from "fs";
import fs from 'fs-jetpack'
import log from "../../../../log";
import {pascalSingular} from "../../../../utils/cases";
import {generatedWarning} from "../../../utils";
import {Entity} from "../../../builders/buildedTypes";
import {
  GenerationPathCategory,
  GenerationPathVars,
  resolveGenerationPath,
} from "../../../builders/generationPaths";

/** `[gen]`-файлы legacy-страниц List/Show, которые в режиме descriptor не нужны. */
const legacyPageCategories: GenerationPathCategory[] = [
  GenerationPathCategory.UiPageListDefault,
  GenerationPathCategory.UiPageListDefaultFilter,
  GenerationPathCategory.UiPageShowDefaultEntityShow,
  GenerationPathCategory.UiPageShowDefaultMainTab,
  GenerationPathCategory.UiPageShowDefaultActions,
];

/** Стандартные `[once]`-заглушки страниц сущности (всё, что runlify создаёт один раз). */
const stubPageCategories: GenerationPathCategory[] = [
  GenerationPathCategory.UiPageListIndex,
  GenerationPathCategory.UiPageListFilter,
  GenerationPathCategory.UiPageListBreadcrumbs,
  GenerationPathCategory.UiPageShowIndex,
  GenerationPathCategory.UiPageShowMainTab,
  GenerationPathCategory.UiPageShowAdditionalTabs,
  GenerationPathCategory.UiPageCreateIndex,
  GenerationPathCategory.UiPageEditIndex,
];

const resolvePath = (
  args: ProjectWideGenerationArgs,
  category: GenerationPathCategory,
  vars: GenerationPathVars,
) => resolveGenerationPath({
  category,
  detachedBackProject: args.options.detachedBackProject,
  detachedUiProject: args.options.detachedUiProject,
  pathsConfig: args.system.generationPaths,
  vars,
});

const entityVars = (entityName: string): GenerationPathVars => ({
  entityName,
  // pascalSingular('_') is empty, and an empty variable is not allowed by resolveGenerationPath
  pascalSingular: pascalSingular(entityName) || entityName,
});

const getPagesDirPath = (args: ProjectWideGenerationArgs) => {
  const samplePage = resolvePath(args, GenerationPathCategory.UiPageIcon, entityVars('_'));

  // src/adm/pages/{entityName}/{pascalSingular}Icon.tsx → src/adm/pages
  return join(samplePage, '..', '..');
};

const isInsidePagesDir = (pagesDirPath: string, path: string) => {
  const rel = relative(pagesDirPath, path);

  return rel !== '' && !rel.startsWith('..') && !/^([A-Za-z]:)?[\\/]/.test(rel);
};

const isGeneratedFile = (path: string) => {
  try {
    return readFileSync(path, 'utf8').includes(generatedWarning);
  } catch {
    return false;
  }
};

const listFilesRecursively = (dirPath: string): string[] => {
  const result: string[] = [];

  for (const name of readdirSync(dirPath)) {
    const fullPath = join(dirPath, name);

    if (statSync(fullPath).isDirectory()) {
      result.push(...listFilesRecursively(fullPath));
    } else {
      result.push(fullPath);
    }
  }

  return result;
};

interface CleanContext {
  pagesDirPath: string;
  removed: string[];
}

const remove = (ctx: CleanContext, path: string, reason: string) => {
  if (!isInsidePagesDir(ctx.pagesDirPath, path)) {
    log.warn(`ui pages: refuse to remove ${path} — it is outside of ${ctx.pagesDirPath}`);

    return;
  }

  fs.remove(path);
  ctx.removed.push(path);
  log.info(`${reason}: removed ${path}`);
};

/** (a) Легаси-страницы у сущностей в режиме descriptor и дескрипторы у legacy-сущностей. */
const cleanLegacyPagesOfDescriptorEntities = (
  args: ProjectWideGenerationArgs,
  ctx: CleanContext,
) => {
  for (const entity of args.entities) {
    const vars = entityVars(entity.name);
    const mode = entity.forms.uiPagesMode ?? 'legacy';

    if (mode !== 'descriptor') {
      const descriptorPath = resolvePath(args, GenerationPathCategory.UiPageDescriptor, vars);

      if (existsSync(descriptorPath) && isGeneratedFile(descriptorPath)) {
        remove(ctx, descriptorPath, 'ui pages');
      }

      continue;
    }

    for (const category of legacyPageCategories) {
      const path = resolvePath(args, category, vars);

      if (existsSync(path)) {
        remove(ctx, path, 'ui pages');
      }
    }

    const tabsDirPath = dirname(resolvePath(args, GenerationPathCategory.UiPageShowDependencyTab, {
      ...vars,
      OwnerPascal: '_',
      FromFieldPascal: '_',
    }));

    if (!existsSync(tabsDirPath)) {
      continue;
    }

    for (const name of readdirSync(tabsDirPath)) {
      const fullPath = join(tabsDirPath, name);

      if (statSync(fullPath).isFile() && isGeneratedFile(fullPath)) {
        remove(ctx, fullPath, 'ui pages');
      }
    }

    if (readdirSync(tabsDirPath).length === 0) {
      remove(ctx, tabsDirPath, 'ui pages');
    }
  }
};

/** (b) Иконки сущностей при выключенном `genUiEntityIcons`. */
const cleanEntityIcons = (args: ProjectWideGenerationArgs, ctx: CleanContext) => {
  if (args.options.genUiEntityIcons !== false) {
    return;
  }

  for (const entity of args.entities) {
    const iconPath = resolvePath(args, GenerationPathCategory.UiPageIcon, entityVars(entity.name));

    if (existsSync(iconPath) && isGeneratedFile(iconPath)) {
      remove(ctx, iconPath, 'ui pages');
    }
  }
};

const isOrphanPageDir = (args: ProjectWideGenerationArgs, name: string, fullPath: string) => {
  if (!statSync(fullPath).isDirectory()) {
    return false;
  }

  const isAdditionalService = args.system.additionalServices.some(
    (additionalService) => additionalService.name === name,
  );

  if (isAdditionalService) {
    return false;
  }

  return !args.entities.some((entity: Entity) => entity.name === name);
};

const getOrphanPageDirs = (args: ProjectWideGenerationArgs, pagesDirPath: string) =>
  readdirSync(pagesDirPath)
    .map((name) => ({name, fullPath: join(pagesDirPath, name)}))
    .filter(({name, fullPath}) => isOrphanPageDir(args, name, fullPath));

/** (c) Каталоги страниц без сущности: удаляем, только если внутри нет ничего рукописного. */
const pruneOrphanPageDirs = (args: ProjectWideGenerationArgs, ctx: CleanContext) => {
  const dryRun = !!args.options.pruneDryRun;

  for (const {name, fullPath} of getOrphanPageDirs(args, ctx.pagesDirPath)) {
    const files = listFilesRecursively(fullPath);
    const generatedFiles = files.filter(isGeneratedFile);
    const stubPaths = new Set(
      stubPageCategories.map((category) => resolvePath(args, category, entityVars(name))),
    );
    const handwrittenFiles = files
      .filter((file) => !generatedFiles.includes(file))
      .filter((file) => !stubPaths.has(file));

    if (handwrittenFiles.length === 0) {
      if (dryRun) {
        log.info(`prune: would remove directory ${fullPath} with ${files.length} file(s)`);
        files.forEach((file) => log.info(`prune: would remove ${file}`));

        continue;
      }

      files.forEach((file) => log.info(`prune: removed ${file}`));
      remove(ctx, fullPath, 'prune');

      continue;
    }

    for (const file of generatedFiles) {
      if (dryRun) {
        log.info(`prune: would remove ${file}`);

        continue;
      }

      remove(ctx, file, 'prune');
    }

    log.warn(
      `prune: ${fullPath} is kept, there is no "${name}" entity but the folder has own files: ${
        handwrittenFiles.map((file) => relative(fullPath, file)).join(', ')
      }`,
    );
  }
};

const warnOrphanPageDirs = (args: ProjectWideGenerationArgs, pagesDirPath: string) => {
  for (const {name, fullPath} of getOrphanPageDirs(args, pagesDirPath)) {
    log.warn(`ui: Entity ${name} not found for pages path ${fullPath}, please delete this folder or move folder content to new path`);
  }
};

export default (
  args: ProjectWideGenerationArgs,
) => {
  const pagesDirPath = getPagesDirPath(args);

  if (!existsSync(pagesDirPath)) {
    return;
  }

  const ctx: CleanContext = {pagesDirPath, removed: []};

  cleanLegacyPagesOfDescriptorEntities(args, ctx);
  cleanEntityIcons(args, ctx);

  if (args.options.pruneOrphanPages) {
    pruneOrphanPageDirs(args, ctx);
  } else {
    warnOrphanPageDirs(args, pagesDirPath);
  }

  if (ctx.removed.length > 0) {
    log.info(`ui pages: removed ${ctx.removed.length} path(s) in ${pagesDirPath}`);
  }
};
