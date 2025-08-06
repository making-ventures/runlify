import {join} from 'path'
import {FileCreator} from '../../types'
import {pascal} from '../../../../utils/cases'
import {EntityWideGenerationArgs} from '../../../args'
import {uiListWidgetTmpl} from '../../../generators/fileTemplates/ui/widgets/list/ListWidget'
import {uiCountWidgetTmpl} from '../../../generators/fileTemplates/ui/widgets/count/CountWidget'
import {addWarnings} from '../../fileHandlers'

const generateFrontSrcEntityWidgets = (
  fileCreator: FileCreator,
  args: EntityWideGenerationArgs,
) => {
  const {
    entity,
    options,
  } = args;

  if (!options.typesOnly) {
    const widgetsDir = join(options.detachedUiProject, 'src', 'adm', 'widgets');

    // CountWidget
    if (options.genUiCountWidget) {
      const countWdgetsDir = join(widgetsDir, 'count');

      const generatedResources = uiCountWidgetTmpl(args);

      fileCreator.create(
        join(countWdgetsDir, `Count${pascal(entity.name)}Widget.tsx`),
        generatedResources,
        addWarnings({options: args.options})
      );
    }

    // ListWidget
    if (options.genUiListWidget) {
      const listWdgetsDir = join(widgetsDir, 'list');

      const generatedResources = uiListWidgetTmpl(args);

      fileCreator.create(
        join(listWdgetsDir, `List${pascal(entity.name)}Widget.tsx`),
        generatedResources,
        addWarnings({options: args.options})
      );
    }
  }
}

export default generateFrontSrcEntityWidgets;
