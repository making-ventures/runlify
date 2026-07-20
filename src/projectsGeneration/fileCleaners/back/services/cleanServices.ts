import {dirname, join} from "path";
import {ProjectWideGenerationArgs} from "../../../args";
import {readdirSync, statSync} from "fs";
import log from "../../../../log";
import {camelCase} from "change-case";
import {
  GenerationPathCategory,
  resolveGenerationPath,
} from "../../../builders/generationPaths";

export default (
  entityWideGenerationArgs: ProjectWideGenerationArgs,
) => {
  const sampleService = resolveGenerationPath({
    category: GenerationPathCategory.BackServiceBaseServices,
    detachedBackProject: entityWideGenerationArgs.options.detachedBackProject,
    detachedUiProject: entityWideGenerationArgs.options.detachedUiProject,
    pathsConfig: entityWideGenerationArgs.system.generationPaths,
    vars: {},
  })
  const pagesDirPath = dirname(sampleService)

  const pattern = '.*(?=Service.ts)'
  const listWidgetFilenameRegex = new RegExp(pattern, 'gum');
  const pagesDirContent = readdirSync(pagesDirPath);

  pagesDirContent.forEach((name) => {
    const fullPath = join(pagesDirPath, name);

    const statData = statSync(fullPath);

    if (statData.isFile()) {
      return;
    }

    const entityNameMatches = name.match(listWidgetFilenameRegex);

    if (!entityNameMatches) {
      return;
    }

    const entityName = camelCase(entityNameMatches[0]);

    const isAdditionalService = entityWideGenerationArgs.system.additionalServices.some((additionalService) => 
      additionalService.name === entityName,
    );

    if (isAdditionalService) {
      return;
    }

    const entity = entityWideGenerationArgs.entities.find((entity) => entity.name === entityName);

    if (!entity) {
      log.warn(`back: Entity ${entityName} not found for services path ${fullPath}, please delete this folder or move folder content to new path`);
    }
  })
}
