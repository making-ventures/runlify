import {dirname, join} from "path";
import {ProjectWideGenerationArgs} from "../../../args";
import {readdirSync, statSync} from "fs";
import log from "../../../../log";
import {
  GenerationPathCategory,
  resolveGenerationPath,
} from "../../../builders/generationPaths";

export default (
  entityWideGenerationArgs: ProjectWideGenerationArgs,
) => {
  const samplePage = resolveGenerationPath({
    category: GenerationPathCategory.UiPageIcon,
    detachedBackProject: entityWideGenerationArgs.options.detachedBackProject,
    detachedUiProject: entityWideGenerationArgs.options.detachedUiProject,
    pathsConfig: entityWideGenerationArgs.system.generationPaths,
    vars: {
      entityName: '_',
      pascalSingular: '_',
    },
  })
  const pagesDirPath = dirname(samplePage)

  const pagesDirContent = readdirSync(pagesDirPath);

  pagesDirContent.forEach((name) => {
    const isAdditionalService = entityWideGenerationArgs.system.additionalServices.some((additionalService) => 
      additionalService.name === name,
    );

    if (isAdditionalService) {
      return;
    }

    const fullPath = join(pagesDirPath, name);

    const statData = statSync(fullPath);

    if (statData.isFile()) {
      return;
    }

    const entity = entityWideGenerationArgs.entities.find((entity) => entity.name === name);

    if (!entity) {
      log.warn(`ui: Entity ${name} not found for pages path ${fullPath}, please delete this folder or move folder content to new path`);
    }
  });
}
