import { ProjectWideGenerationArgs } from "../../args";
// import cleanPages from "./pages/cleanPages";
import cleanWidgets from './widgets/cleanWidgets';

export default async (
  entityWideGenerationArgs: ProjectWideGenerationArgs,
) => {
  return Promise.all([
    // imposible due additional service structure
    // cleanPages(entityWideGenerationArgs),
    cleanWidgets(entityWideGenerationArgs),
  ])
}