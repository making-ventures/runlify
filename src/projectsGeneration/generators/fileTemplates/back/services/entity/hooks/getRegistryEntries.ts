import { Document } from '../../../../../../builders/buildedTypes'
import { pascalPlural, pascalSingular } from '../../../../../../../utils/cases'
import { singular } from 'pluralize'

export const getRegistryEntriesTmpl = (_prefix: string, document: Document) => {
  const contextName = 'Context'

  return `import {
  StrictUpdate${pascalSingular(document.name)}Args,
} from '../${pascalPlural(document.name)}Service';
import {${contextName}} from '../../types';
import {${pascalSingular(
    document.name
  )}RegistryEntries} from './getPostOperations';

export const getRegistryEntries = async (
  _ctx: ${contextName},
  _data: StrictUpdate${pascalSingular(document.name)}Args,
): Promise<${pascalSingular(document.name)}RegistryEntries> => {
  return {
    ${document.registries.map((r) => `${singular(r)}: [],`).join(`
    `)}
  };
};
`
}
