import { BaseNode, ObjectExpression } from 'estree-jsx';
import { b } from 'code-red';

export default class DataProperty {
  private propertyKeys: Record<string, boolean>;
  private node: ObjectExpression;

  constructor(node: ObjectExpression) {
    this.node = node;
    this.propertyKeys = {};

    if (this.node) {
      this.parseNode();
    }
  }

  protected parseNode(): void {
    const { properties } = this.node;

    properties.forEach((property) => {
      if (property.type === 'Property' && property.key.type === 'Identifier') {
        this.propertyKeys[property.key.name] = true;
      }
    });
  }

  public generateNode(): BaseNode[] {
    return b`
      const getState = () => {
        return ${this.node || '{}'}
      }
    `;
  }

  public getDependencies(): Record<string, boolean> {
    return this.propertyKeys;
  }
}
