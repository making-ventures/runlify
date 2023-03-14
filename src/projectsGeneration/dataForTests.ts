import {BaseField} from './builders';
import {BaseFieldBuilder} from './builders/fields/BaseFieldBuilder';

class FieldBuilder extends BaseFieldBuilder {}

export const baseField: BaseField = new FieldBuilder('userId', 'ru', '').setRequiredOnInput(true).build()
