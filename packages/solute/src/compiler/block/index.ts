import { BaseNode, JSXElement, JSXExpressionContainer, Literal } from 'estree-jsx';

import {
  BaseElement,
  StaticElement,
  TagElement,
  LogicalExpressionElement,
  ConditionalExpressionElement,
  CallExpressionElement,
  TextExpressionElement,
} from '../elements';
import Builder from './builder';
import Component from '../component';

export default class Block {
  private builder: Builder;
  private component: Component;

  constructor(node: BaseNode, component: Component) {
    this.builder = new Builder();
    this.component = component;
    this.create(node);
  }

  private nodeBuilder<T>(element: BaseElement<T>, parent: BaseNode) {
    const declarations = element.generateDelcaration();
    this.builder.addToDeclaration(declarations);

    const create = element.generateCreate();
    this.builder.addToCreate(create);

    const mount = element.generateMount(parent);
    this.builder.addToMount(mount);

    const update = element.generateUpdate();

    if (update) {
      this.builder.addToUpdate(update);
    }
  }

  private create(node: BaseNode, parent?: BaseNode): void {
    if (node.type === 'JSXElement') {
      const {
        openingElement: { name },
        children,
      } = node as JSXElement;

      if (name.type === 'JSXIdentifier') {
        const element = new TagElement(node as JSXElement, this.component, name.name);
        this.nodeBuilder(element, parent);

        children.forEach((child) => {
          switch (child.type) {
            case 'JSXElement': {
              this.create(child, node);

              break;
            }

            case 'JSXText': {
              const element = new StaticElement(child, this.component);
              this.nodeBuilder(element, node);

              break;
            }

            case 'JSXExpressionContainer': {
              const { expression } = child as JSXExpressionContainer;

              switch (expression.type) {
                case 'Identifier':
                case 'MemberExpression': {
                  const element = new TextExpressionElement(expression, this.component);
                  this.nodeBuilder(element, node);

                  break;
                }

                case 'LogicalExpression': {
                  const element = new LogicalExpressionElement(expression, this.component);
                  this.nodeBuilder(element, node);

                  break;
                }

                case 'ConditionalExpression': {
                  const element = new ConditionalExpressionElement(expression, this.component);
                  this.nodeBuilder(element, node);

                  break;
                }

                case 'CallExpression': {
                  const { callee } = expression;

                  if (callee.type === 'MemberExpression') {
                    const element = new CallExpressionElement(expression, this.component);
                    this.nodeBuilder(element, node);
                  }

                  break;
                }
              }
            }

            default:
              break;
          }
        });
      }
    } else if (node.type === 'Literal') {
      const element = new StaticElement(node as Literal, this.component);
      this.nodeBuilder(element, parent);
    }
  }

  public generate(name: string): BaseNode[] {
    return this.builder.generate(name);
  }
}
