import BaseBuilder from './BaseBuilder'
import PageBuilder from './PageBuilder';
import { Report } from './buildedTypes'

class ReportBuilder extends BaseBuilder {
  page: PageBuilder;

  constructor(name: string, defaultLanguage: string, title?: string) {
    super(name, defaultLanguage, {singular: title})

    this.page = new PageBuilder(`reports.${name}`, `reports/${name}`, this.defaultLanguage, title)
  }
  
  setTitle(title: {singular: string}, language?: string) {
    super.setTitle(title, language);
    
    if (this.page) {
      this.page.setTitle(title, language);
    }

    return this
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
