import {Field} from '../../../../builders';
import {ShowComponentName} from '../types';
import {isMarkdownField} from "../../../../metaUtils";

export const getCompNameToShowScalar = (field: Field): ShowComponentName => {
  switch (field.type) {
    case 'string':
      if (isMarkdownField(field)) {
        return 'ReactMarkdownField';
      }
      return 'TextField'
    case 'int':
      return 'NumberField'
    case 'bigint':
      return 'NumberField'
    case 'float':
      return 'NumberField'
    case 'bool':
      return 'BooleanField'
    case 'datetime':
      return 'DateField'
    case 'date':
      return 'DateField'
    // default:
    //   throw new Error(`Unexpected "${field.type}" type`)
  }
}
