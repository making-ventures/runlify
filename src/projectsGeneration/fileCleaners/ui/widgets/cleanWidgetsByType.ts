import {join} from "path";
import {Entity} from "../../../builders";
import {readdirSync, statSync, unlinkSync} from "fs";
import {camelCase} from "change-case";
import fs from 'fs-jetpack'

const patternByType = {
  count: '(?<=^Count)(.*)(?=Widget.tsx)',
  list: '(?<=^List)(.*)(?=Widget.tsx)'
}

const cleanWidgetsByType = (
  widgetsDirPath: string,
  entities: Entity[],
  type: 'count' | 'list',
  widgetGenOn: boolean,
) => {
  const listWidgetsDirPath = join(widgetsDirPath, type);

  fs.dir(listWidgetsDirPath);

  const listWidgetsDirContent = readdirSync(listWidgetsDirPath);
  const listWidgetFilenameRegex = new RegExp(patternByType[type], 'gum');

  listWidgetsDirContent.forEach((name) => {
    const fullPath = join(listWidgetsDirPath, name);

    const statData = statSync(fullPath);

    if (statData.isDirectory()) {
      return;
    }

    const entityNameMatches = name.match(listWidgetFilenameRegex);

    if (!entityNameMatches) {
      return;
    }

    const entityName = camelCase(entityNameMatches[0]);

    const entity = entities.find((entity) => entity.name === entityName);

    if (!entity || !widgetGenOn) {
      unlinkSync(fullPath);
    }
  })
}

export default cleanWidgetsByType;
