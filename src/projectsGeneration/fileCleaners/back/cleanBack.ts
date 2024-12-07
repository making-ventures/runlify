import { ProjectWideGenerationArgs } from "../../args";
// import cleanGraphServices from "./graphServices/cleanGraphServices";
// import cleanServices from "./services/cleanServices";

export default async (
  _entityWideGenerationArgs: ProjectWideGenerationArgs,
) => {
  // imposible due additional service structure
  return Promise.all([
    // cleanServices(entityWideGenerationArgs),
    // cleanGraphServices(entityWideGenerationArgs),
  ])
}