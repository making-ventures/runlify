import {ProjectWideGenerationArgs} from "../../args";
import cleanPages from './pages/cleanPages';
import cleanWidgets from './widgets/cleanWidgets';

export default (
  entityWideGenerationArgs: ProjectWideGenerationArgs,
) => {
  cleanWidgets(entityWideGenerationArgs);
  cleanPages(entityWideGenerationArgs);
}