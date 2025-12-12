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

После отзыва классических токенов npm (9 декабря 2025) доступны два варианта: **OIDC Trusted Publisher** (рекомендуется) или **granular access tokens**.

### Вариант 1: OIDC Trusted Publisher (Рекомендуется) 🔒

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

---

### Вариант 2: Granular Access Token (Fallback)

Если OIDC не настроен, можно использовать granular access token как резервный вариант.

#### Создание токена:

**Через веб-интерфейс:**
1. Перейдите на https://www.npmjs.com/settings/~/tokens
2. Нажмите "Generate New Token"
3. Выберите тип: **Automation** (для CI/CD)
4. Установите права: **Read and Publish**
5. **Важно:** Включите опцию **"Bypass 2FA"** (для неинтерактивных workflow)
6. Установите срок действия (максимум 90 дней для токенов записи)
7. Скопируйте созданный токен

**Через CLI:**
```shell
npm login
npm token create --type automation --read-write
```

#### Настройка в GitLab CI/CD:

1. Откройте ваш проект в GitLab
2. Перейдите в **Settings → CI/CD → Variables**
3. Создайте переменную `NPM_TOKEN`
4. Вставьте созданный granular access token
5. Убедитесь, что переменная помечена как **Masked** (скрыта в логах)

#### Важные замечания:

- ⚠️ **Токены записи действительны максимум 90 дней** - необходимо периодически обновлять токен
- ✅ Токен с "Bypass 2FA" позволяет публиковать пакеты без двухфакторной аутентификации

---

### Проверка работы

После настройки (OIDC или токена) запустите job `release` вручную. Он должен:
- Автоматически определить метод аутентификации (OIDC или токен)
- Проверить аутентификацию
- Опубликовать пакет в npm

# License

MIT - see LICENSE

