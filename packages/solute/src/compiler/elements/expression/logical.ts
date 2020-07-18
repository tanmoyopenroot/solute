import { x, b } from 'code-red';
import { walk } from 'estree-walker';
import { BaseNode, Expression, LogicalExpression, MemberExpression } from 'estree-jsx';

import Block from '../../block';
import Component from '../../component';
import BaseElement from './../base-element';
import createVariable from '../../utils/create-variable';

export default class LogicalExpressionElement extends BaseElement<LogicalExpression> {
  private blockFunction: string;
  private variable: string;
  private dependentUpon: string;

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

  private extractDependencies() {
    const self = this;
    const { left } = this.node;

    walk(left, {
      enter(node) {
        if (node.type === 'MemberExpression') {
          const { object, property } = node as MemberExpression;

          if (object.type === 'ThisExpression' && property.type === 'Identifier') {
            self.dependentUpon = property.name;
          }
        }
      },
    });
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

    return b`
      ${this.variable} = ${left} && ${this.blockFunction}()
      ${this.variable} && ${this.variable}.create.call(this)
    `;

    // return [
    //   x`${this.variable} = ${left} && ${this.blockFunction}()`,
    //   x`${this.variable} && ${this.variable}.create.call(this)`,
    // ];
  }

  public generateMount(parent?: BaseNode): Expression {
    const target = (parent && parent['variable']) || 'target';
    return x`${this.variable} && ${this.variable}.mount.call(this, ${target})`;
  }

  public generateUpdate(): BaseNode[] | null {
    if (this.dependentUpon) {
      const { left } = this.node;
      const dependencies = this.component.getDependencies();

      // const isFunctionOrVarible = dependencies.computed[this.dependentUpon]

      return b`
        if (dirty === 'Test') {
          if (${left}) {
            if (${this.variable}) {
              ${this.variable}.update.call(this, dirty);
            } else {
              ${this.variable} = createIfBlock1();
              ${this.variable} && ${this.variable}.create.call(this);
              ${this.variable} && ${this.variable}.mount.call(this, target);
            }
          } else {
            ${this.variable} && ${this.variable}.destroy();
            ${this.variable} = null;
          }
        }
      `;
    }
  }
}

export { LogicalExpressionElement };
