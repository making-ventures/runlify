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

interface Forms {
  list: ListForm;
  show: ShowForm;
}

export default Forms;
