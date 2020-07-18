import { x, b } from 'code-red';
import { BaseNode, Expression, JSXText, Literal } from 'estree-jsx';

import BaseElement from './base-element';
import Component from '../component';
import createVariable from '../utils/create-variable';
export default class StaticElement extends BaseElement<JSXText | Literal> {
  private variable: string;

  constructor(node: JSXText | Literal, component: Component) {
    super(node, component);

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
    return b`${this.variable} = text('${(this.node as JSXText).raw}')`;
  }

  public generateMount(parent?: BaseNode): Expression {
    const target = (parent && parent['variable']) || 'target';
    return x`append(${target}, ${this.variable})`;
  }
}

export { StaticElement };
