import { BaseNode, Expression } from 'estree-jsx';

export default abstract class BaseElement<T> {
  protected type: string;
  protected node: T;

  constructor(node: T) {
    this.node = node;
  }

  public abstract generateDelcaration(): BaseNode;
  public abstract generateCreate(): BaseNode[];
  public abstract generateMount(parent?: BaseNode): Expression;

  protected abstract generateVariable(): void;
  protected abstract attachVariable(): void;
}

export { BaseElement };
