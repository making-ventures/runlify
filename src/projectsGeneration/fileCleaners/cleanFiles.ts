import { ProjectWideGenerationArgs } from "../args";
import cleanBack from "./back/cleanBack";
import cleanUi from './ui/cleanUi';

export default async (
  entityWideGenerationArgs: ProjectWideGenerationArgs,
) => {
  return Promise.all([
    cleanUi(entityWideGenerationArgs),
    cleanBack(entityWideGenerationArgs),
  ])
}