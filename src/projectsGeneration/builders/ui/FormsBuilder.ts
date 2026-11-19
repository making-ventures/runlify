import BaseSavableEntityBuilder from '../BaseSavableEntityBuilder'
import Forms, {UiPagesMode} from './Forms'
import ListFormBuilder from './ListFormBuilder'
import ShowFormBuilder from './ShowFormBuilder';

class FormsBuilder {
  private getEntity: () => BaseSavableEntityBuilder;
  private list: ListFormBuilder;
  private show: ShowFormBuilder;
  private uiPagesMode: UiPagesMode = 'legacy';

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

  setUiPagesMode(mode: UiPagesMode): this {
    this.uiPagesMode = mode;

    return this;
  }

  getUiPagesMode(): UiPagesMode {
    return this.uiPagesMode;
  }

  build(): Forms {
    return {
      list: this.list.build(),
      show: this.show.build(),
      uiPagesMode: this.uiPagesMode,
    }
  }
}

export default FormsBuilder;
