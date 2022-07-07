import BaseBuilder from './BaseBuilder'
import { Report } from './buildedTypes'

class ReportBuilder extends BaseBuilder {
  constructor(name: string, defaultLanguage: string, title?: string) {
    super(name, defaultLanguage, title)
  }

  build(): Report {
    return {
      type: 'report',
      name: this.name,
      title: this.title,
      needFor: this.needFor,
      materialUiIcon: this.materialUiIcon,
    }
  }

  static fromObject(obj: any, defaultLanguage: string): ReportBuilder {
    const builder = new ReportBuilder(obj.name, defaultLanguage)

    return builder
  }
}

export default ReportBuilder
