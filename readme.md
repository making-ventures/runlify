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

## Настройка CI/CD для автоматической публикации в NPM

После отзыва классических токенов npm (9 декабря 2025) используется **OIDC Trusted Publisher** для безопасной автоматической публикации.

### OIDC Trusted Publisher 🔒

Этот метод не требует токенов и работает автоматически через доверенную связь между GitLab и npm.

#### Настройка в npm:

1. Перейдите на страницу настроек вашего пакета: https://www.npmjs.com/package/runlify (или ваш пакет)
2. Откройте вкладку **Settings**
3. Найдите секцию **"Trusted Publisher"**
4. Заполните форму:
   - **Publisher**: выберите `GitLab CI/CD`
   - **Namespace**: укажите namespace вашего GitLab проекта (например, `your-username` или `your-group`)
   - **Project name**: укажите имя проекта (например, `runlify`)
   - **Top-level CI file path**: укажите `.gitlab-ci.yml`
   - **Environment name** (опционально): можно указать имя окружения, например `release`
5. Нажмите **"Set up connection"**

#### Настройка в GitLab:

Конфигурация уже настроена в `.gitlab-ci.yml`. Никаких дополнительных переменных окружения не требуется!

#### Преимущества OIDC:

- ✅ Не требует токенов - полностью автоматическая аутентификация
- ✅ Не нужно обновлять токены каждые 90 дней
- ✅ Максимальная безопасность - публикация возможна только из настроенного репозитория
- ✅ Работает с любыми настройками 2FA в npm
- ✅ Полностью автоматический процесс - никакого ручного вмешательства не требуется

### Проверка работы

После настройки Trusted Publisher запустите job `release` вручную в GitLab CI/CD. Он должен:
- Автоматически использовать OIDC токен для аутентификации
- Опубликовать пакет в npm без вашего участия
- Увеличить версию и закоммитить изменения автоматически

# License

MIT - see LICENSE

