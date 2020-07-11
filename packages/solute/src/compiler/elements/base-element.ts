import { BaseNode, Expression } from 'estree-jsx';
import Component from '../component';

export default abstract class BaseElement<T> {
  protected node: T;
  protected component: Component;

  constructor(node: T, component: Component) {
    this.component = component;
    this.node = node;
  }

  public abstract generateDelcaration(): BaseNode;
  public abstract generateCreate(): BaseNode[];
  public abstract generateMount(parent?: BaseNode): Expression;
}

export { BaseElement };
