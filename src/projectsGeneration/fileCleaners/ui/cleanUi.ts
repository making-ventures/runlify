import {ProjectWideGenerationArgs} from "../../args";
import cleanWidgets from './widgets/cleanWidgets';

export default async (
  entityWideGenerationArgs: ProjectWideGenerationArgs,
) => {
  return Promise.all([
    cleanWidgets(entityWideGenerationArgs),
  ])
}