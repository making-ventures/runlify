import {exists, write} from 'fs-jetpack'
import {FileToCreate} from './types';

export const createFilesToWriteUtils = () => {
  let files: FileToCreate[] = [];

  return {
    create: (path: string, content: string) => files.push({path, content, ifNotExists: false}),
    createIfNotExists: (path: string, content: string) => files.push({path, content, ifNotExists: true}),
    getFiles: () => files,
    reset: () => files = [],
  };
}

export const writeFiles = (files: FileToCreate[]) => {
  for (const file of files) {
    if (file.ifNotExists && exists(file.path)) {
      continue;
    }

    write(file.path, file.content);
  }
}
