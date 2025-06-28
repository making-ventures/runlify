import {ProjectWideGenerationArgs} from "../args";
import cleanUi from './ui/cleanUi';

export default (
  entityWideGenerationArgs: ProjectWideGenerationArgs,
) => {
  cleanUi(entityWideGenerationArgs);
}