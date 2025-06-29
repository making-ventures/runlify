import {join} from 'path'
import {FileCreator} from '../../../types'
import {
  prepareAdditionalServiceWideGenerationArgs,
  ProjectWideGenerationArgs,
} from '../../../../args'
import generateBackAdditionalService from './generateBackAdditionalService'
import { additionalServicesTmpl } from '../../../../generators/fileTemplates/back/services/AdditionalServices'

const generateBackAdditionalServices = (fileCreator: FileCreator, args: ProjectWideGenerationArgs) => {
  const prjDetachedBackSrcDir = join(args.options.detachedBackProject, 'src');
  const prjBackSrcPrefixedDir = join(prjDetachedBackSrcDir, 'adm');
  const servicesDir = join(prjBackSrcPrefixedDir, 'services');

  args.additionalServices.forEach((service) =>
    generateBackAdditionalService(fileCreator, prepareAdditionalServiceWideGenerationArgs(args, service))
  );
  fileCreator.createIfNotExists(join(servicesDir, 'AdditionalServices.ts'), additionalServicesTmpl());
}

export default generateBackAdditionalServices;
