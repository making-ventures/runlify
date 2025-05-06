export interface TemplateDoc {
  rootGroup: TemplateDocBlockGroup
}

export interface TemplateDocBlockGroup {
  title?: string
  description?: string
  example?: string
  children: TemplateDocBlockGroup[]
}
