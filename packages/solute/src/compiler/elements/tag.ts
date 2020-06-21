import { BaseNode, Expression } from 'estree-jsx';
import { x, b } from 'code-red';

import BaseElement from './base-element';
import createVariable from '../utils/create-variable';


export default class TagElement extends BaseElement {
  private node: BaseNode;
  private tag: string;
  private variable: string;
  constructor(node: BaseNode, tag: string) {
    super();

    this.type = 'TextElement';
    this.node = node;
    this.tag = tag;

    this.generateVariable();
    this.attachVariable();
  }

  private generateVariable() {
    this.variable = createVariable(`${this.tag}`);
  }

  private attachVariable() {
    Reflect.defineProperty(
      this.node,
      'variable',
      { value: this.variable },
    );
  }

  public generateDelcaration(): BaseNode {
    const decalaration =  b`let ${this.variable}`;
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
