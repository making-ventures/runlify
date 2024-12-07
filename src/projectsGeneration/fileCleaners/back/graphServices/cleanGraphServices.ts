import { join } from "path";
import { ProjectWideGenerationArgs } from "../../../args";
import { readdirSync, statSync } from "fs";
import log from "../../../../log";

export default async (
  entityWideGenerationArgs: ProjectWideGenerationArgs,
) => {
  const pagesDirPath = join(
    entityWideGenerationArgs.options.detachedBackProject, 
    'src',
    'adm',
    'graph',
    'services',
  )

  const pagesDirContent = readdirSync(pagesDirPath);

  return Promise.all(pagesDirContent.map(async (name) => {
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

    return new Promise((resolve) => resolve(null));
  }))
}