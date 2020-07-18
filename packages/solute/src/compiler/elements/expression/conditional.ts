import { x, b } from 'code-red';
import { BaseNode, Expression, ConditionalExpression } from 'estree-jsx';

import Block from '../../block';
import Component from '../../component';
import BaseElement from './../base-element';
import createVariable from '../../utils/create-variable';

export default class ConditionalExpressionElement extends BaseElement<ConditionalExpression> {
  private ifBlockFunction: string;
  private elseBlockFunction: string;
  private variable: string;

  constructor(node: ConditionalExpression, component: Component) {
    super(node, component);

    this.generateVariable();
    this.attachVariable();
    this.generateBody();
  }

  protected generateVariable(): void {
    this.variable = createVariable('ifBlock');
    this.ifBlockFunction = createVariable('createIfBlock');
    this.elseBlockFunction = createVariable('createIfBlock');
  }

  private generateConsequentBlock(): BaseNode[] {
    const { consequent } = this.node;
    return new Block(consequent, this.component).generate(this.ifBlockFunction);
  }

  private generateAlternateBlock(): BaseNode[] {
    const { alternate } = this.node;
    return new Block(alternate, this.component).generate(this.elseBlockFunction);
  }

  private generateBody(): void {
    this.component.addToBody(this.generateConsequentBlock());
    this.component.addToBody(this.generateAlternateBlock());
  }

  protected attachVariable(): void {
    Reflect.defineProperty(this.node, 'variable', { value: this.variable });
  }

  public generateDelcaration(): BaseNode {
    const decalaration = b`let ${this.variable}`;
    return decalaration[0];
  }

  public generateCreate(): BaseNode[] {
    const { test } = this.node;

    return b`
      ${this.variable} = ${test} ? ${this.ifBlockFunction}() : ${this.elseBlockFunction}();
      ${this.variable} && ${this.variable}.create.call(this);
    `;
  }

  public generateMount(parent?: BaseNode): Expression {
    return x`append(${parent['variable'] || 'target'}, ${this.variable})`;
  }
}

export { ConditionalExpressionElement };
