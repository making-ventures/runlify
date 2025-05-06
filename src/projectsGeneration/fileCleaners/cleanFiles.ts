import { ProjectWideGenerationArgs } from "../args";
import cleanUi from './ui/cleanUi';

export default async (
  entityWideGenerationArgs: ProjectWideGenerationArgs,
) => {
  return Promise.all([
    cleanUi(entityWideGenerationArgs),
  ])
}