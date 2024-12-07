import { join } from "path";
import { ProjectWideGenerationArgs } from "../../../args";
import cleanWidgetsByType from "./cleanWidgetsByType";

export default async (
  entityWideGenerationArgs: ProjectWideGenerationArgs,
) => {
  const widgetsDirPath = join(
    entityWideGenerationArgs.options.detachedUiProject, 
    'src',
    'adm',
    'widgets',
  )

  return Promise.all([
    cleanWidgetsByType(
      widgetsDirPath,
      entityWideGenerationArgs.entities,
      'count',
      entityWideGenerationArgs.options.genUiCountWidget,
    ),
    cleanWidgetsByType(
      widgetsDirPath,
      entityWideGenerationArgs.entities,
      'list',
      entityWideGenerationArgs.options.genUiListWidget,
    ),
  ])
}