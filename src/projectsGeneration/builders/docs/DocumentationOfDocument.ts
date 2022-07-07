export type TypeWayOfCreation = 'manual' | 'auto' | 'byApi'

export type WayOfCreation =
  | {
      type: 'auto' | 'byApi'
    }
  | {
      type: 'manual'
      byRoles: string[]
    }

export interface DocumentationOfDocument {
  waysOfCreation: WayOfCreation[]
}
