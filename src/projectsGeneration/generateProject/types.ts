export interface FileToCreate {
  path: string;
  content: string;
  ifNotExists: boolean;
}

export interface FileCreator {
  createIfNotExists: (path: string, content: string) => void;
  create: (path: string, content: string) => void;
}