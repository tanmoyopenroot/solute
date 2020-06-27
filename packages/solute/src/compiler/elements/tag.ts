import { BaseNode, Expression } from 'estree-jsx';
import { x, b } from 'code-red';

import BaseElement from './base-element';
import createVariable from '../utils/create-variable';

export default class TagElement extends BaseElement<BaseNode> {
  private tag: string;
  private variable: string;

  constructor(node: BaseNode, tag: string) {
    super(node);

    this.type = 'TextElement';
    this.tag = tag;
  }

  protected generateVariable(): void {
    this.variable = createVariable(`${this.tag}`);
  }

  protected attachVariable(): void {
    Reflect.defineProperty(this.node, 'variable', { value: this.variable });
  }

  public generateDelcaration(): BaseNode {
    const decalaration = b`let ${this.variable}`;
    return decalaration[0];
  }

  public generateCreate(): BaseNode[] {
    return b`${this.variable} = createElement(${this.tag})`;
  }

  public generateMount(parent?: BaseNode): Expression {
    const target = (parent && parent['variable']) || 'target';
    return x`append(${target}, ${this.variable})`;
  }
}

export { TagElement };
