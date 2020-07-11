import { x, b } from 'code-red';
import { BaseNode, Expression, LogicalExpression } from 'estree-jsx';

import Block from '../block';
import Component from '../component';
import BaseElement from './base-element';
import createVariable from '../utils/create-variable';

export default class LogicalExpressionElement extends BaseElement<LogicalExpression> {
  private blockFunction: string;
  private variable: string;

  constructor(node: LogicalExpression, component: Component) {
    super(node, component);

    this.generateVariable();
    this.attachVariable();
    this.generateBody();
  }

  protected generateVariable(): void {
    this.variable = createVariable('ifBlock');
    this.blockFunction = createVariable('createIfBlock');
  }

  protected attachVariable(): void {
    Reflect.defineProperty(this.node, 'variable', { value: this.variable });
  }

  private generateBody(): void {
    const { right } = this.node;
    const block = new Block(right, this.component).generate(this.blockFunction);

    this.component.addToBody(block);
  }

  public generateDelcaration(): BaseNode {
    const decalaration = b`let ${this.variable}`;
    return decalaration[0];
  }

  public generateCreate(): BaseNode[] {
    const { left, operator } = this.node;

    // Need to fix this
    // 1: Operator
    // 2: Return type

    return [
      x`${this.variable} = ${left} && ${this.blockFunction}()`,
      x`${this.variable} && ${this.variable}.create.call(this)`,
    ];
  }

  public generateMount(parent?: BaseNode): Expression {
    const target = (parent && parent['variable']) || 'target';
    return x`${this.variable} && ${this.variable}.mount.call(this, ${target})`;
  }
}

export { LogicalExpressionElement };
