export interface ListFormFilterField {
  name: string
  hidden: boolean
  alwaysOn: boolean
}

export interface ListFormFilter {
  fields: ListFormFilterField[]
}

export interface ListForm {
  filter: ListFormFilter
}

interface Forms {
  listForm: ListForm
}

export default Forms;
