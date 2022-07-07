import { TelegramBot } from './buildedTypes'
import BaseBuilder from './BaseBuilder'

class TelegramBotBuilder extends BaseBuilder {
  constructor(name: string, defaultLanguage: string, title?: string) {
    super(name, defaultLanguage, title)
  }

  build(): TelegramBot {
    return {
      type: 'telegramBot',
      name: this.name,
      title: this.title,
      needFor: this.needFor,
      materialUiIcon: this.materialUiIcon,
    }
  }
}

export default TelegramBotBuilder
