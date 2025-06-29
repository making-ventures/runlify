import {FileCreator} from '../../types'
import {EntityWideGenerationArgs} from '../../../args'
import generateFrontSrcEntityPages from './generateFrontSrcEntityPages'
import generateFrontSrcEntityWidgets from './generateFrontSrcEntityWidgets'
import generateFrontSrcEntityIcon from './generateFrontSrcEntityIcon'
import generateFrontSrcGetEntityValidation from './generateFrontSrcGetEntityValidation'

const generateFrontSrcEntity = (
  fileCreator: FileCreator,
  args: EntityWideGenerationArgs,
) => {
  generateFrontSrcEntityIcon(fileCreator, args);
  generateFrontSrcGetEntityValidation(fileCreator, args);
  generateFrontSrcEntityWidgets(fileCreator, args);
  generateFrontSrcEntityPages(fileCreator, args);
}

export default generateFrontSrcEntity;
