import { BaseNode } from 'estree-jsx';

export default class Chunks {
  public body: BaseNode[];

  constructor() {
    this.reset();
  }

  private reset() {
    this.body = [];
  }
}
