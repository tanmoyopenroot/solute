import { walk } from 'estree-walker';
import { x, b } from 'code-red';
import { BaseNode, Expression, CallExpression, JSXElement, MemberExpression } from 'estree-jsx';

import Block from '../block';
import Component from '../component';
import BaseElement from './base-element';
import createVariable from '../utils/create-variable';

export default class CallExpressionElement extends BaseElement<CallExpression> {
  private blockAst: JSXElement;
  private blockFunction: string;
  private variable: string;

  constructor(node: CallExpression, component: Component) {
    super(node, component);

    this.generateVariable();
    this.attachVariable();
    this.parserAST();
    this.generateBody();
  }

  protected generateVariable(): void {
    this.variable = createVariable('callBlock');
    this.blockFunction = createVariable('createCallBlock');
  }

  protected attachVariable(): void {
    Reflect.defineProperty(this.node, 'variable', { value: this.variable });
  }

  private parserAST() {
    const self = this;

    walk(this.node, {
      enter(node) {
        if (node.type === 'JSXElement') {
          self.blockAst = JSON.parse(JSON.stringify(node as JSXElement));

          this.replace(x`${self.blockFunction}()`);
          this.skip();
        }
      },
    });
  }

  private generateBody(): void {
    if (!this.blockAst) {
      return;
    }

    const block = new Block(this.blockAst, this.component).generate(this.blockFunction);
    this.component.addToBody(block);
  }

  public generateDelcaration(): BaseNode {
    const decalaration = b`let ${this.variable}`;
    return decalaration[0];
  }

  public generateCreate(): BaseNode[] {
    const { callee } = this.node;
    const { object } = callee as MemberExpression;

    return [
      x`${this.variable} = Array.isArray(${object}) && ${this.blockFunction}()`,
      x`${this.variable} && ${this.variable}.create.call(this)`,
    ];
  }

  public generateMount(parent?: BaseNode): Expression {
    const { callee } = this.node;
    const { object } = callee as MemberExpression;
    const target = (parent && parent['variable']) || 'target';

    return x`
      Array.isArray(${object}) && ${this.variable}.forEach(block => {
        block.mount.call(this, ${target})
      })
    `;
  }
}

export { CallExpressionElement };
