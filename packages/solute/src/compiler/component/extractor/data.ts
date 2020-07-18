import { BaseNode, ObjectExpression } from 'estree-jsx';
import { b } from 'code-red';

import { IExtractedDependencies } from '../interfaces';

export default class Data {
  private dependencies: IExtractedDependencies;
  private node: ObjectExpression;

  constructor(node: ObjectExpression) {
    this.node = node;
    this.dependencies = {
      type: 'data',
      properties: {},
    };

    if (this.node) {
      this.parseNode();
    }
  }

  protected parseNode(): void {
    const { properties } = this.node;

    properties.forEach((property) => {
      if (property.type === 'Property' && property.key.type === 'Identifier') {
        this.dependencies.properties[property.key.name] = [];
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

  public getDependencies(): IExtractedDependencies {
    return this.dependencies;
  }
}
