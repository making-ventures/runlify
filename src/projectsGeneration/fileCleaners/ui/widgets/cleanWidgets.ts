import {join} from "path";
import {ProjectWideGenerationArgs} from "../../../args";
import cleanWidgetsByType from "./cleanWidgetsByType";

export default (
  entityWideGenerationArgs: ProjectWideGenerationArgs,
) => {
  const widgetsDirPath = join(
    entityWideGenerationArgs.options.detachedUiProject, 
    'src',
    'adm',
    'widgets',
  )

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