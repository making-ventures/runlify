import BaseBuilder from './BaseBuilder'
import { Report } from './buildedTypes'

class ReportBuilder extends BaseBuilder {
  constructor(name: string, defaultLanguage: string, title?: string) {
    super(name, defaultLanguage, {singular: title})
  }

  build(): Report {
    return {
      ...super.build(),
      type: 'report',
    }
  }

  static fromObject(obj: any, defaultLanguage: string): ReportBuilder {
    const builder = new ReportBuilder(obj.name, defaultLanguage)

    return builder
  }
}

export default ReportBuilder
