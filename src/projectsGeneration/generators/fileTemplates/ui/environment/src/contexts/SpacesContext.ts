import { pascal } from '../../../../../../../utils/cases'
import { ProjectWideGenerationArgs } from '../../../../../../args'
import { generatedWarning } from '../../../../../../utils'

export const uiSpacesContextTmpl = ({
  system: { prefix },
  options,
}: ProjectWideGenerationArgs) => `import React, {
  createContext,
  memo,
  useMemo,
  ReactNode,
  useContext,
  useState,
  useCallback,
} from 'react';
import {
  envConfig,
} from '../config/envConfig';
${
  options.skipWarningThisIsGenerated
    ? ''
    : `
// ${generatedWarning}
`
}
export enum Space {
  ${pascal(prefix)} = '${pascal(prefix)}',
  Demo = 'Demo',
}

export const allSpaces = [
  Space.${pascal(prefix)},
];

export interface ISpacesContext {
  availableSpaces: Space[];
  setAvailableSpaces: (spaces: Space[]) => void;
  isSpaceAvailable: (space: Space) => boolean;
}

interface IProps {
  children: ReactNode | ReactNode[];
}

export const SpacesContext = createContext<ISpacesContext>(
  {} as ISpacesContext,
);

export const SpacesProvider = memo((props: IProps) => {
  const [availableSpaces, setAvailableSpaces] = useState<Space[]>(
    (envConfig.spaces && !envConfig.spaces.includes('SPACES')) ?
    envConfig.spaces.split(',') as Space[] :
      allSpaces,
  );

  const isSpaceAvailable = useCallback((space: Space) => availableSpaces.includes(space), [availableSpaces]);

  const context = useMemo<ISpacesContext>(
    () => ({
      availableSpaces,
      isSpaceAvailable,
      setAvailableSpaces,
    }),
    [availableSpaces, isSpaceAvailable],
  );

  return <SpacesContext.Provider {...props} value={context} />;
});

export const useSpaces = (): ISpacesContext =>
  useContext(SpacesContext) as ISpacesContext;
`
