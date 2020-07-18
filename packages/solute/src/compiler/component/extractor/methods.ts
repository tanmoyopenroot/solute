import { walk } from 'estree-walker';
import { BaseNode, ObjectExpression, ExpressionStatement, MemberExpression } from 'estree-jsx';
import { x, b } from 'code-red';

export default class Methods {
  private node: ObjectExpression;

  constructor(node: ObjectExpression, dependencies: Record<string, boolean>) {
    this.node = node;

    if (this.node) {
      this.parseNode(dependencies);
    }
  }
  private parseNode(dependencies: Record<string, boolean>): void {
    let currentExpressionNode: ExpressionStatement = null;
    let dynamic = null;

    walk(this.node, {
      enter(node, parent) {
        if (node.type == 'ExpressionStatement') {
          const { expression } = node as ExpressionStatement;

          if (expression.type === 'AssignmentExpression' && expression.left.type === 'MemberExpression') {
            currentExpressionNode = node as ExpressionStatement;
          }
        } else if (currentExpressionNode && node.type === 'ThisExpression') {
          const { property } = parent as MemberExpression;

          if (property.type === 'Identifier' && dependencies[`${property.name}`]) {
            dynamic = `${property.name}`;
          }
        }
      },
      leave(node) {
        if (node.type == 'ExpressionStatement' && currentExpressionNode && dynamic) {
          this.replace(x`
            this.$setState("${dynamic}", () => {
              ${node}
            })
          `);

          currentExpressionNode = null;
          dynamic = null;
        }
      },
    });
  }

  public generateNode(): BaseNode[] {
    return b`
      const getMethods = () => {
        return ${this.node || '{}'}
      }
    `;
  }
}
