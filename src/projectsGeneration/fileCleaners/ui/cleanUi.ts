import {ProjectWideGenerationArgs} from "../../args";
import cleanWidgets from './widgets/cleanWidgets';

export default (
  entityWideGenerationArgs: ProjectWideGenerationArgs,
) => {
  cleanWidgets(entityWideGenerationArgs);
}