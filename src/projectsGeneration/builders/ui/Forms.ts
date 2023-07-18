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

export interface Forms {
  listForm: ListForm
}
