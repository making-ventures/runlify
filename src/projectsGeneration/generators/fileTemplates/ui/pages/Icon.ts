import {EntityWideGenerationArgs} from '../../../../args'

export const uiEntityIconTmpl = ({
  entity,
}: EntityWideGenerationArgs) => `export {default} from '@mui/icons-material/${
  entity.materialUiIcon
}';
`
