import { BaseNode, Expression } from 'estree-jsx';

export default abstract class BaseElement {
  public type: string;

  abstract generateDelcaration(): BaseNode;
  abstract generateCreate(): BaseNode[];
  abstract generateMount(parent?: BaseNode): Expression;
}

export { BaseElement };