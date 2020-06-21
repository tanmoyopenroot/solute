import {
  BaseNode,
  JSXElement,
  JSXExpressionContainer,
  Expression,
} from 'estree-jsx';

import {
  TextElement,
  TagElement,
  LogicalExpressionElement,
  // ConditionalExpressionElement,
} from '../elements';
import { b } from 'code-red';

export default class Fragment {
  public chunks: {
		body: BaseNode[];
		declarations: BaseNode[];
		create: BaseNode[];
		mount: Expression[];
		update: Expression[];
		destroy: Expression[];
	};

  constructor(node: BaseNode) {
    this.chunks = {
      body: [],
			declarations: [],
			create: [],
			mount: [],
			update: [],
			destroy: [],
    };
    
    this.create(node);
  }

  private create(node: BaseNode, parent?: BaseNode): void {
    if (node.type === 'JSXElement') {
      const {
        openingElement: { name },
        children,
      } = (node as JSXElement);

      if (name.type === 'JSXIdentifier') {
        const element = new TagElement(node, name.name);
        const declarations = element.generateDelcaration();
        const create = element.generateCreate();
        const mount = element.generateMount(parent);

        this.addToDeclaration(declarations);
        this.addToCreate(create);
        this.addToMount(mount);

        children.forEach(child => {
          switch (child.type) {
            case 'JSXElement': {
              this.create(child, node);

              break;
            }
  
            case 'JSXText': {
              const element = new TextElement(child);
              const declarations = element.generateDelcaration();
              const create = element.generateCreate();
              const mount = element.generateMount(node);
      
              this.addToDeclaration(declarations);
              this.addToCreate(create);
              this.addToMount(mount);

              break;
            }
  
            case 'JSXExpressionContainer': {
              const { expression } = (child as JSXExpressionContainer);

              switch (expression.type) {
                case 'Identifier': 
                case 'MemberExpression': {
                  const element = new TextElement(expression);
                  const declarations = element.generateDelcaration();
                  const create = element.generateCreate();
                  const mount = element.generateMount(node);
          
                  this.addToDeclaration(declarations);
                  this.addToCreate(create);
                  this.addToMount(mount);

                  break;
                }

                case 'LogicalExpression': {
                  const element = new LogicalExpressionElement(expression);
                  const declarations = element.generateDelcaration();
                  const create = element.generateCreate();
                  const mount = element.generateMount(node);
                  const block = element.generateConditionalBlock();

                  this.addToBody(block);
                  this.addToDeclaration(declarations);
                  this.addToCreate(create);
                  this.addToMount(mount);

                  break;
                }

                // case 'ConditionalExpression': {
                //   const element = new ConditionalExpressionElement(child);
                //   const declarations = element.generateDelcaration();
                //   const create = element.generateCreate();
                //   const mount = element.generateMount(node);

                //   this.addToDeclaration(declarations);
                //   this.addToCreate(create);
                //   this.addToMount(mount);

                //   break;
                // }

                case 'CallExpression': {
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

  private addToBody(code: BaseNode[]): void {
    this.chunks.body.push(...code);
  }

  private addToDeclaration(code: BaseNode): void {
    this.chunks.declarations.push(code);
  }

  private addToCreate(code: BaseNode[]): void {
    this.chunks.create.push(...code);
  }

  private addToMount(code: Expression): void {
    this.chunks.mount.push(code);
  }

  public generate(name: string): BaseNode[] {
    const block =  b`
      ${this.chunks.body.map(data => data)}

      const ${name} = () => {
        ${this.chunks.declarations.map(data => data)}

        return {
          create() {
            ${this.chunks.create.map(data => data)}
          },
          mount() {
            ${this.chunks.mount.map(data => data)}
          },
        }
      };
    `;

    return block;
  }
}
