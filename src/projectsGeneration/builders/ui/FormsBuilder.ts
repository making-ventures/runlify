import BaseSavableEntityBuilder from '../BaseSavableEntityBuilder'
import Forms from './Forms'
import ListFormBuilder from './ListFormBuilder'
import ShowFormBuilder from './ShowFormBuilder';

class FormsBuilder {
  private getEntity: () => BaseSavableEntityBuilder;
  private list: ListFormBuilder;
  private show: ShowFormBuilder;

  constructor(getEntity: () => BaseSavableEntityBuilder) {
    this.getEntity = getEntity;

    this.list = new ListFormBuilder(this.getEntity);
    this.show = new ShowFormBuilder(this.getEntity);
  }

  getListForm(): ListFormBuilder {
    return this.list;
  }

  getShowForm(): ShowFormBuilder {
    return this.show;
  }

  build(): Forms {
    return {
      list: this.list.build(),
      show: this.show.build(),
    }
  }
}

export default FormsBuilder;
