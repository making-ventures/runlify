import { IndexType } from './buildedTypes'
import IdFieldBuilder from './fields/IdFieldBuilder'
import LinkFieldBuilder from './fields/LinkFieldBuilder'
import ScalarFieldBuilder from './fields/ScalarFieldBuilder'
import ViewLinkFieldBuilder from './fields/ViewLinkFieldBuilder'

export type FieldBuilder =
  | ScalarFieldBuilder
  | IdFieldBuilder
  | LinkFieldBuilder
  | ViewLinkFieldBuilder

export type Index = {
  fields: string[],
  type?: IndexType,
}