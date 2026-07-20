import {FileCreator} from '../../types'
import {pascal} from '../../../../utils/cases'
import {EntityWideGenerationArgs} from '../../../args'
import {uiListWidgetTmpl} from '../../../generators/fileTemplates/ui/widgets/list/ListWidget'
import {uiCountWidgetTmpl} from '../../../generators/fileTemplates/ui/widgets/count/CountWidget'
import {addWarnings} from '../../fileHandlers'
import {
  GenerationPathCategory,
  resolveGenerationPath,
} from '../../../builders/generationPaths'

const generateFrontSrcEntityWidgets = (
  fileCreator: FileCreator,
  args: EntityWideGenerationArgs,
) => {
  const {
    entity,
    options,
    system,
  } = args;

  if (!options.typesOnly) {
    const resolveUiWidgetPath = (category: GenerationPathCategory) =>
      resolveGenerationPath({
        category,
        detachedBackProject: options.detachedBackProject,
        detachedUiProject: options.detachedUiProject,
        pathsConfig: system.generationPaths,
        vars: {PascalEntity: pascal(entity.name)},
      });

    if (options.genUiCountWidget) {
      fileCreator.create(
        resolveUiWidgetPath(GenerationPathCategory.UiWidgetCount),
        uiCountWidgetTmpl(args),
        addWarnings({options: args.options})
      );
    }

    if (options.genUiListWidget) {
      fileCreator.create(
        resolveUiWidgetPath(GenerationPathCategory.UiWidgetList),
        uiListWidgetTmpl(args),
        addWarnings({options: args.options})
      );
    }
  }
}

export default generateFrontSrcEntityWidgets;
