import {FileCreator} from '../../../types'
import {pascal} from '../../../../../utils/cases'
import {ProjectWideGenerationArgs} from '../../../../args'
import {singular} from 'pluralize'
import {enumTmpl} from '../../../../generators/fileTemplates/back/enum'
import {devEnumTmpl} from '../../../../generators/fileTemplates/back/devEnum'
import {initCommonEnumTmpl} from '../../../../generators/fileTemplates/back/initCommon'
import {initDevEnumTmpl} from '../../../../generators/fileTemplates/back/initDev'
import {backEntitiesEnumTmpl} from '../../../../generators/fileTemplates/back/backEntitiesEnumTmpl'
import {initEntities} from '../../../../generators/fileTemplates/back/initEntities'
import {addWarnings} from '../../../fileHandlers'
import {
  GenerationPathCategory,
  GenerationPathVars,
  resolveGenerationPath,
} from '../../../../builders/generationPaths'

const resolveBackPath = (
  args: ProjectWideGenerationArgs,
  category: GenerationPathCategory,
  vars: GenerationPathVars = {},
) =>
  resolveGenerationPath({
    category,
    detachedBackProject: args.options.detachedBackProject,
    detachedUiProject: args.options.detachedUiProject,
    pathsConfig: args.system.generationPaths,
    vars,
  })

const generateBackEnums = (fileCreator: FileCreator, args: ProjectWideGenerationArgs) => {
  args.entities
    .filter((e) => e.predefinedElements.length > 0)
    .forEach((entity) => {
      fileCreator.create(
        resolveBackPath(args, GenerationPathCategory.BackTypeEnum, {
          pascalSingular: pascal(singular(entity.name)),
        }),
        enumTmpl(entity, args.options),
        addWarnings({options: args.options})
      )
    })
}

const generateBackEntityEnum = (
  fileCreator: FileCreator,
  args: ProjectWideGenerationArgs,
) => {
  fileCreator.create(
    resolveBackPath(args, GenerationPathCategory.BackTypeEntityEnum),
    backEntitiesEnumTmpl(args),
    addWarnings({options: args.options})
  )
}

const generateBackEnumsInit = (
  fileCreator: FileCreator,
  args: ProjectWideGenerationArgs,
) => {
  args.entities
    .filter((e) => e.predefinedElements.length > 0)
    .forEach((entity) => {
      fileCreator.create(
        resolveBackPath(args, GenerationPathCategory.BackInitCommonEnum, {
          PascalEntity: pascal(entity.name),
        }),
        initCommonEnumTmpl(entity, args.options),
        addWarnings({options: args.options})
      )
  })
}

const generateBackEntitiesEnumInit = (
  fileCreator: FileCreator,
  args: ProjectWideGenerationArgs,
) => {
  fileCreator.create(
    resolveBackPath(args, GenerationPathCategory.BackInitCommonEntities),
    initEntities(args),
    addWarnings({options: args.options})
  )
}

const generateBackDevEnums = (fileCreator: FileCreator, args: ProjectWideGenerationArgs) => {
  args.entities
    .filter((e) => e.devPerefinedElements.length > 0)
    .forEach((entity) => {
      fileCreator.create(
        resolveBackPath(args, GenerationPathCategory.BackTypeDevEnum, {
          pascalSingular: pascal(singular(entity.name)),
        }),
        devEnumTmpl(entity, args.options),
        addWarnings({options: args.options})
      )
    })
}

const generateBackDevEnumsInit = (
  fileCreator: FileCreator,
  args: ProjectWideGenerationArgs,
) => {
  args.entities
    .filter((e) => e.devPerefinedElements.length > 0)
    .forEach((entity) => {
      fileCreator.create(
        resolveBackPath(args, GenerationPathCategory.BackInitDevEnum, {
          PascalEntity: pascal(entity.name),
        }),
        initDevEnumTmpl(entity, args.options),
        addWarnings({options: args.options})
      )
    })
}

const generateBackEnumsAndInits = (fileCreator: FileCreator, args: ProjectWideGenerationArgs) => {
  generateBackEnums(fileCreator, args);
  generateBackEnumsInit(fileCreator, args);
  generateBackEntityEnum(fileCreator, args);
  generateBackEntitiesEnumInit(fileCreator, args);
  generateBackDevEnums(fileCreator, args);
  generateBackDevEnumsInit(fileCreator, args);
}

export default generateBackEnumsAndInits;
