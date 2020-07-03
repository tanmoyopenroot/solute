import { x, b } from 'code-red';
import { BaseNode, Expression, JSXText } from 'estree-jsx';

import BaseElement from './base-element';
import createVariable from '../utils/create-variable';
export default class TextElement extends BaseElement<BaseNode> {
  private variable: string;

  constructor(node: BaseNode) {
    super(node);

    this.type = 'TextElement';
    this.generateVariable();
    this.attachVariable();
  }

  protected generateVariable(): void {
    this.variable = createVariable('text');
  }

  protected attachVariable(): void {
    Reflect.defineProperty(this.node, 'variable', { value: this.variable });
  }

  public generateDelcaration(): BaseNode {
    const decalaration = b`let ${this.variable}`;
    return decalaration[0];
  }

  public generateCreate(): BaseNode[] {
    if (this.node.type === 'JSXText') {
      return b`${this.variable} = text('${(this.node as JSXText).raw}')`;
    }

    return b`${this.variable} = text(${this.node})`;
  }

  public generateMount(parent?: BaseNode): Expression {
    const target = (parent && parent['variable']) || 'target';
    return x`append(${target}, ${this.variable})`;
  }
}

export { TextElement };
