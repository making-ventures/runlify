import {exists, write} from 'fs-jetpack'
import {FileHandler, FileToCreate} from './types';

export const createFilesToWriteUtils = () => {
  let files: FileToCreate[] = [];

  return {
    create: (path: string, content: string, handlers: FileHandler[] = []) => files.push({path, content, ifNotExists: false, handlers}),
    createIfNotExists: (path: string, content: string) => files.push({path, content, ifNotExists: true, handlers: []}),
    getFiles: () => files,
    reset: () => files = [],
  };
}

export const writeFiles = (files: FileToCreate[]) => {
  for (const file of files) {
    if (file.ifNotExists && exists(file.path)) {
      continue;
    }

    const content = file.handlers.reduce((content, handler) => handler(content),  file.content)

    write(file.path, content);
  }
}
