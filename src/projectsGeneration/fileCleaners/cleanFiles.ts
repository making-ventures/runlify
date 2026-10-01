import {ProjectWideGenerationArgs} from "../args";
import cleanUi from './ui/cleanUi';
import cleanStaleRuntimeMetaGraphFiles from './back/graphServices/cleanStaleRuntimeMetaGraphFiles';

export default (
  entityWideGenerationArgs: ProjectWideGenerationArgs,
) => {
  // Not UI-specific, so unlike cleanUi below it isn't gated by genFrontend.
  cleanStaleRuntimeMetaGraphFiles(entityWideGenerationArgs);

  if (entityWideGenerationArgs.options.genFrontend) {
    cleanUi(entityWideGenerationArgs);
  }
}