import {
  BootstrapEntityOptions,
  defaultBootstrapEntityOptions,
} from '../../../../types'

export const uiFunctionsTmpl = (
  _options: BootstrapEntityOptions = defaultBootstrapEntityOptions
) => {
  return `import React, {
  useCallback,
  useState,
  ChangeEvent,
} from 'react';
import {Typography, TextField, IconButton} from '@mui/material';
import SendIcon from '@mui/icons-material/SendOutlined';
import {
  gql, useLazyQuery,
} from '@apollo/client';

const HELLO = gql\`
  query testHello($name: String!) {
    testHello(name: $name)
  }
\`;

export default () => {
  const [name, setName] = useState('');

  const onNameChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      setName(e.target.value);
    },
    [setName],
  );

  const [hello, {data}] = useLazyQuery(HELLO);

  const onClick = useCallback(() => hello({variables: {name}}), [hello, name]);

  return (
    <div>
      <div style={{height: '7em'}}>
        <Typography >
          Hello
        </Typography>
        <TextField
          label='Name'
          onChange={onNameChange}
          value={name}
        />
        <IconButton
          onClick={onClick}
        >
          <SendIcon />
        </IconButton>
        data: {JSON.stringify(data, undefined, ' ')}
      </div>
    </div>
  );
};
`
}
