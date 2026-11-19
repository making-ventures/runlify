export interface ListFormFilterField {
  name: string;
  hidden: boolean;
  alwaysOn: boolean;
}

export interface ListFormFilter {
  fields: ListFormFilterField[];
}

export interface ListForm {
  filter: ListFormFilter;
}

export interface LinkedEntity {
  entity: string;
  field?: string;
}

export interface ShowForm {
  ignoredLinkedEntities: LinkedEntity[];
}

export type UiPagesMode = 'legacy' | 'descriptor'

interface Forms {
  list: ListForm;
  show: ShowForm;
  uiPagesMode: UiPagesMode;
}

export default Forms;
