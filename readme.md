# ToDo
* Убрать просытыню с `Loadable` элементами
* Привести в проектах команду линтера к одному виду
* Генерить универсальные команды в `package.json`
* Убрать обработку исклбчений через `projectPrefix`

# runlify CLI

A CLI for runlify.

## Customizing your CLI

Check out the documentation at https://github.com/infinitered/gluegun/tree/master/docs.

## Publishing to NPM

To package your CLI up for NPM, do this:

```shell
npm login
npm whoami
yarn test

newVersion.sh

yarn run build

npm publish
```

## Publishing custom tag to NPM

```shell
npm login
npm whoami
yarn test
npm version 0.0.762-update-react-admin.1 --no-git-tag-version
yarn run build
npm publish --tag update-react-admin
```

# License

MIT - see LICENSE

