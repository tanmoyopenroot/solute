import { x, b } from 'code-red';
import { BaseNode, Expression, ConditionalExpression } from 'estree-jsx';

import BaseElement from './base-element';
import createVariable from '../utils/create-variable';

export default class ConditionalExpressionElement extends BaseElement {
  private node: ConditionalExpression;
  private ifBlockFunction: string;
  private elseBlockFunction: string;
  private variable: string;
  constructor(node: ConditionalExpression) {
    super();

    this.type = 'ConditionalExpressionElement';
    this.node = node;

    this.generateVariable();
    this.attachVariable();
  }

  private generateVariable() {
    this.variable = createVariable('ifBlock');
    this.ifBlockFunction = createVariable('createIfBlock');
    this.elseBlockFunction = createVariable('createIfBlock');
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
    const { test } = this.node;

    return b`
      ${this.variable} = ${test} ? ${this.ifBlockFunction} : ${this.elseBlockFunction}();
      ${this.variable} && ${this.variable}.create.call(this);
    `;
  }

  public generateMount(parent?: BaseNode): Expression {
    return x`append(${parent['variable'] || 'target' }, ${this.variable})`;
  }
}

export { ConditionalExpressionElement };
