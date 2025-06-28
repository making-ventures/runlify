import {pascalCase, camelCase, sentenceCase, capitalCase} from 'change-case'
import pluralize from 'pluralize'

export const pascalSingular = (str: string): string =>
  pascalCase(pluralize(str, 1))
export const pascalPlural = (str: string): string =>
  pascalCase(pluralize(str, 2))
export const camelSingular = (str: string): string =>
  camelCase(pluralize(str, 1))
export const camelPlural = (str: string): string => camelCase(pluralize(str, 2))

export const pascal = (str: string): string => pascalCase(str)
export const camel = (str: string): string => camelCase(str)
export const sentence = (str: string): string => sentenceCase(str)
export const capital = (str: string): string => capitalCase(str)
export const upper = (str: string): string => str.toUpperCase()
