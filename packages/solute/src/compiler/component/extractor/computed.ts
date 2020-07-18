import { BaseNode, ObjectExpression, MemberExpression } from 'estree-jsx';
import { walk } from 'estree-walker';
import { b } from 'code-red';

import { IExtractedDependencies } from '../interfaces';

export default class Computed {
  private dependencies: IExtractedDependencies;
  private node: ObjectExpression;

  constructor(node: ObjectExpression) {
    this.node = node;
    this.dependencies = {
      type: 'computed',
      properties: {},
    };

    if (this.node) {
      this.parseNode();
    }
  }

  protected parseNode(): void {
    const { properties } = this.node;

    properties.forEach((property) => {
      if (
        property.type === 'Property' &&
        property.key.type === 'Identifier' &&
        property.value.type === 'FunctionExpression'
      ) {
        const dependentUpon = [];

        walk(property.value, {
          enter(node) {
            if (node.type === 'MemberExpression') {
              const { object, property } = node as MemberExpression;

              if (object.type === 'ThisExpression' && property.type === 'Identifier') {
                dependentUpon.push(property.name);
              }
            }
          },
        });

        this.dependencies.properties[property.key.name] = dependentUpon;
      }
    });
  }

  public generateNode(): BaseNode[] {
    return b`
      const getComputed = () => {
        return ${this.node || '{}'}
      }
    `;
  }

  public getDependencies(): IExtractedDependencies {
    return this.dependencies;
  }
}
