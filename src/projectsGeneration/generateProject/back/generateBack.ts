import {FileCreator} from '../types'
import {ProjectWideGenerationArgs} from '../../args'
import {generateBackElasticBootstrap} from '../generateBackElasticBootstrap';
import {generateBackClickHouseBootstrap} from '../generateBackClickHouseBootstrap';
import generateBackDocs from './docs/generateBackDocs'
import generateBackSrc from './src/generateBackSrc'
import generateBackEnvs from './generateBackEnvs';

const generateBack = (fileCreator: FileCreator, args: ProjectWideGenerationArgs) => {
  if (!args.options.typesOnly) {
    generateBackEnvs(fileCreator, args);
    generateBackDocs(fileCreator, args);
    generateBackElasticBootstrap(fileCreator, args);
    generateBackClickHouseBootstrap(fileCreator, args);
  }

  generateBackSrc(fileCreator, args);
}

export default generateBack;
