import {
  BaseNode,
  Expression,
} from 'estree-jsx';

export default class Chunks {
  public body: BaseNode[];
	public declarations: BaseNode[];
	public create: BaseNode[];
	public mount: Expression[];
	public update: Expression[];
  public destroy: Expression[];

  constructor() {
    this.reset();
  }

  private reset() {
    this.body = [];
    this.declarations = [];
    this.create = [];
    this.mount = [];
    this.update = [];
    this.destroy = [];
  }
}