import {FileCreator} from '../types'
import {ProjectWideGenerationArgs} from '../../args'
import generateFrontSrc from './generateFrontSrc'

const generateFront = (fileCreator: FileCreator, args: ProjectWideGenerationArgs) => {
  generateFrontSrc(fileCreator, args);
}

export default generateFront;
