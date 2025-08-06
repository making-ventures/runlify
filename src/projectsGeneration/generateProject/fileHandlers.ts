import {BootstrapEntityOptions} from "../types";
import {FileHandler} from "./types";

export function disableEslintForCode(content: string): string {
  return '/* eslint-disable */\n' + content 
}

export function addDoNotEditThisIsGeneratedFileForCode(content: string): string {
  return '\n//\n// DO NOT EDIT! THIS IS GENERATED FILE\n//\n\n' + content;
}

export function addDoNotEditThisIsGeneratedFileForYaml(content: string): string {
  return '\n#\n# DO NOT EDIT! THIS IS GENERATED FILE\n#\n\n' + content;
}

type addWarningsInput = {
  options: BootstrapEntityOptions,
  fileType?: 'code' | 'yaml',
  disableEslint?: boolean,
  addDoNotEdit?: boolean,
}

export function addWarnings({options, fileType = 'yaml', disableEslint = true, addDoNotEdit = true}: addWarningsInput): FileHandler[] {
  if (options.skipWarningThisIsGenerated) {
    return []
  }

  const result: FileHandler[] = [] 

  if (fileType == 'code' && addDoNotEdit) {
    result.push(addDoNotEditThisIsGeneratedFileForCode)
  }

  if (fileType == 'yaml' && addDoNotEdit) {
    result.push(addDoNotEditThisIsGeneratedFileForYaml)
  }

  if (fileType == 'code' && disableEslint) {
    result.push(disableEslintForCode)
  }
   
  return result
}