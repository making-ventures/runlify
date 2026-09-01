export interface FileToCreate {
  path: string;
  content: string;
  ifNotExists: boolean;
  handlers: FileHandler[];
}

export type FileHandler = (content: string) => string

export interface FileCreator {
  createIfNotExists: (path: string, content: string, handlers?: FileHandler[]) => void;
  create: (path: string, content: string, handlers?: FileHandler[]) => void;
}