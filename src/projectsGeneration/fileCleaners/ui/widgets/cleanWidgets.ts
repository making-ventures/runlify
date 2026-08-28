import {ProjectWideGenerationArgs} from "../../../args";
import {resolveUiWidgetsDir} from "../../../builders/generationPaths";
import cleanWidgetsByType from "./cleanWidgetsByType";

export default (
  entityWideGenerationArgs: ProjectWideGenerationArgs,
) => {
  const widgetsDirPath = resolveUiWidgetsDir({
    detachedBackProject: entityWideGenerationArgs.options.detachedBackProject,
    detachedUiProject: entityWideGenerationArgs.options.detachedUiProject,
    pathsConfig: entityWideGenerationArgs.system.generationPaths,
  })

  cleanWidgetsByType(
    widgetsDirPath,
    entityWideGenerationArgs.entities,
    'count',
    entityWideGenerationArgs.options.genUiCountWidget,
  );
  cleanWidgetsByType(
    widgetsDirPath,
    entityWideGenerationArgs.entities,
    'list',
    entityWideGenerationArgs.options.genUiListWidget,
  );
}
