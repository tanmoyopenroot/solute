import { BaseNode, Expression } from 'estree-jsx';

export default class Chunks {
  public declarations: BaseNode[];
  public create: BaseNode[];
  public mount: Expression[];
  public update: BaseNode[];
  public destroy: Expression[];

  constructor() {
    this.reset();
  }

  private reset() {
    this.declarations = [];
    this.create = [];
    this.mount = [];
    this.update = [];
    this.destroy = [];
  }
}
