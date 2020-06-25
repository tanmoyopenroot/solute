import {
  BaseNode,
  JSXElement,
  JSXExpressionContainer,
} from 'estree-jsx';

import {
  BaseElement,
  BaseExpressionElement,
  TextElement,
  TagElement,
  LogicalExpressionElement,
  ConditionalExpressionElement,
  CallExpressionElement,
} from '../elements';
import Builder from './builder';

export default class Block {
  private builder: Builder;

  constructor(node: BaseNode) {
    this.builder = new Builder();
    this.create(node);
  }

  private nodeBuilder(element: BaseElement, parent: BaseNode) {
    const declarations = element.generateDelcaration();
    const create = element.generateCreate();
    const mount = element.generateMount(parent);

    this.builder.addToDeclaration(declarations);
    this.builder.addToCreate(create);
    this.builder.addToMount(mount);
  }

  private expressionBuilder(element: BaseExpressionElement, parent: BaseNode) {
    const block = element.generateBody();

    this.builder.addToBody(block);
    this.nodeBuilder(element, parent);
  }

  private create(node: BaseNode, parent?: BaseNode): void {
    if (node.type === 'JSXElement') {
      const {
        openingElement: { name },
        children,
      } = (node as JSXElement);

      if (name.type === 'JSXIdentifier') {
        const element = new TagElement(node, name.name);
        this.nodeBuilder(element, parent);

        children.forEach(child => {
          switch (child.type) {
            case 'JSXElement': {
              this.create(child, node);

              break;
            }
  
            case 'JSXText': {
              const element = new TextElement(child);
              this.nodeBuilder(element, node);

              break;
            }
  
            case 'JSXExpressionContainer': {
              const { expression } = (child as JSXExpressionContainer);

              switch (expression.type) {
                case 'Identifier': 
                case 'MemberExpression': {
                  const element = new TextElement(expression);
                  this.nodeBuilder(element, node);

                  break;
                }

                case 'LogicalExpression': {
                  const element = new LogicalExpressionElement(expression);
                  this.expressionBuilder(element, node);

                  break;
                }

                case 'ConditionalExpression': {
                  const element = new ConditionalExpressionElement(expression);
                  this.expressionBuilder(element, node);

                  break;
                }

                case 'CallExpression': {
                  const { callee } = expression;

                  if (callee.type === 'MemberExpression') {
                    const element = new CallExpressionElement(expression);
                    this.expressionBuilder(element, node);
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
    }
  }

  public generate(name: string): BaseNode[] {
    return this.builder.generate(name);
  }
}