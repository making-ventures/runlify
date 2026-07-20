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
  const sampleGraph = resolveGenerationPath({
    category: GenerationPathCategory.BackGraphHelpBaseTypeDefs,
    detachedBackProject: entityWideGenerationArgs.options.detachedBackProject,
    detachedUiProject: entityWideGenerationArgs.options.detachedUiProject,
    pathsConfig: entityWideGenerationArgs.system.generationPaths,
    vars: {},
  })
  // …/graph/services/help/baseTypeDefs.ts → …/graph/services
  const pagesDirPath = dirname(dirname(sampleGraph))

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
      log.warn(`back: Entity ${name} not found for graph services path ${fullPath}, please delete this folder or move folder content to new path`);
    }
  });
}
