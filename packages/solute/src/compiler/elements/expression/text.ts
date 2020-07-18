import { x, b } from 'code-red';
import { walk } from 'estree-walker';
import { BaseNode, Expression, Identifier, MemberExpression } from 'estree-jsx';

import BaseElement from './../base-element';
import Component from '../../component';
import createVariable from '../../utils/create-variable';

type ITextElement = Identifier | MemberExpression;
class TextExpressionElement extends BaseElement<ITextElement> {
  private variable: string;
  private dependentUpon: string;

  constructor(node: ITextElement, component: Component) {
    super(node, component);

    this.generateVariable();
    this.attachVariable();
    this.extractDependencies();
  }

  private generateVariable(): void {
    this.variable = createVariable('text');
  }

  private attachVariable(): void {
    Reflect.defineProperty(this.node, 'variable', { value: this.variable });
  }

  private extractDependencies() {
    const self = this;

    walk(this.node, {
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

  public generateDelcaration(): BaseNode {
    const decalaration = b`let ${this.variable}`;
    return decalaration[0];
  }

  public generateCreate(): BaseNode[] {
    return b`${this.variable} = text(${this.node})`;
  }

  public generateMount(parent?: BaseNode): Expression {
    const target = (parent && parent['variable']) || 'target';
    return x`append(${target}, ${this.variable})`;
  }

  public generateUpdate(): BaseNode[] | null {
    if (this.dependentUpon) {
      const dependencies = this.component.getDependencies();

      if (dependencies[this.dependentUpon]) {
        return b`
          if (dirty === '${this.dependentUpon}') {
            setTextData(${this.variable}, ${this.node})
          }
        `;
      }
    }

    return null;
  }
}

export { TextExpressionElement };
