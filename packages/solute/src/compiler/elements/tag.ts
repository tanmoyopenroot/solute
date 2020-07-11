import { JSXElement, Expression, BaseNode } from 'estree-jsx';
import { x, b } from 'code-red';

import Component from '../component';
import BaseElement from './base-element';
import createVariable from '../utils/create-variable';

export default class TagElement extends BaseElement<JSXElement> {
  private tag: string;
  private variable: string;

  constructor(node: JSXElement, component: Component, tag: string) {
    super(node, component);

    this.tag = tag;
    this.generateVariable();
    this.attachVariable();
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
    return b`${this.variable} = createElement('${this.tag}')`;
  }

  public generateMount(parent?: BaseNode): Expression {
    const target = (parent && parent['variable']) || 'target';
    return x`append(${target}, ${this.variable})`;
  }
}

export { TagElement };
