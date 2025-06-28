import {exists, write} from 'fs-jetpack'
import {BootstrapEntityOptions, FileToWrite} from '../types';

export const generatedWarning = 'DO NOT EDIT! THIS IS GENERATED FILE'

export const printWarningIfRequired = (options: BootstrapEntityOptions, commentType: 'slash' | 'hash' = 'slash') => options.skipWarningThisIsGenerated
  ? ''
  : `
${commentType === 'slash' ? '//' : '#'} ${generatedWarning}
`;

export const writeFileIfNotExists = async (
  path: string,
  content: string
): Promise<void> => {
  if (!exists(path)) {
    await write(path, content)
  }
}

export const padN = (content: string, num: number) =>
  content
    .split('\n')
    .map((el) => (el.trim() ? '  '.repeat(num) + el : el))
    .join('\n')
export const pad1 = (content: string) => padN(content, 1)
export const pad2 = (content: string) => padN(content, 2)
export const pad3 = (content: string) => padN(content, 3)
export const pad4 = (content: string) => padN(content, 4)
export const pad5 = (content: string) => padN(content, 5)
export const pad6 = (content: string) => padN(content, 6)
export const pad7 = (content: string) => padN(content, 7)
export const pad8 = (content: string) => padN(content, 8)
export const pad9 = (content: string) => padN(content, 9)
export const pad10 = (content: string) => padN(content, 10)
export const pad = (num: number) => (content: string) => padN(content, num)
export const addComma = (content: string) => content + ','
export const newStrBefore = (content: string) => '\n' + content

export const createFilesToWriteUtils = () => {
  let filesToWrite: FileToWrite[] = [];

  return {
    filesToWrite,
    write: (path: string, content: string) => filesToWrite.push({path, content, ifNotExists: false}),
    writeFileIfNotExists: (path: string, content: string) => filesToWrite.push({path, content, ifNotExists: true}),
    reset: () => filesToWrite = [],
  };
}

export const writeFiles = (files: FileToWrite[]) => {
  for (const file of files) {
    if (file.ifNotExists) {
      writeFileIfNotExists(file.path, file.content);
    } else {
      write(file.path, file.content);
    }
  }
}
