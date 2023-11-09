import {ProjectWideGenerationArgs} from '../../../../../args'
import getProjectSpec from './spec/getProjectSpec';

const backDocSpec = ({
  system,
}: ProjectWideGenerationArgs) => getProjectSpec(system)

export default backDocSpec;
