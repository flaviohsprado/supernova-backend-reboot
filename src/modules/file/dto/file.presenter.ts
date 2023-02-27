export class FilePresenter {
  public fieldname: string;

  public originalname: string;

  public url: string;

  constructor(props: FilePresenter) {
    Object.assign(this, props);
  }
}
