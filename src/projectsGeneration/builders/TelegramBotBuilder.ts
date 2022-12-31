import { TelegramBot } from './buildedTypes'
import BaseBuilder from './BaseBuilder'

class TelegramBotBuilder extends BaseBuilder {
  constructor(name: string, defaultLanguage: string, title?: string) {
    super(name, defaultLanguage, title)
  }

  build(): TelegramBot {
    return {
      ...super.build(),
      type: 'telegramBot',
    }
  }
}

export default TelegramBotBuilder
