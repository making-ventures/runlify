import BaseBuilder from './BaseBuilder'
import PageBuilder from './PageBuilder';
import { Report } from './buildedTypes'

class ReportBuilder extends BaseBuilder {
  protected page: PageBuilder;
  protected labels: string[] = [];

  constructor(name: string, defaultLanguage: string, title?: string) {
    super(name, defaultLanguage, {singular: title})

    this.page = new PageBuilder(`reports.${name}`, `/reports/${name}`, `reports.${name}.title`, this.defaultLanguage, title)
      .addRequiredPermission(`reports.${name}`);
  }
  
  setTitle(title: {singular: string}, language?: string) {
    super.setTitle(title, language);
    
    if (this.page) {
      this.page.setTitle(title, language);
    }

    return this
  }
  
  getPage() {
    return this.page;
  }
  
  getLabels() {
    return this.labels;
  }

  build(): Report {
    return {
      ...super.build(),
      type: 'report',
      labels: this.labels,
    }
  }

  static fromObject(obj: any, defaultLanguage: string): ReportBuilder {
    const builder = new ReportBuilder(obj.name, defaultLanguage)

    return builder
  }
}

export default ReportBuilder
