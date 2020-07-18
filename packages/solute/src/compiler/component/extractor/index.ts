import { walk } from 'estree-walker';
import { BaseNode, ExportDefaultDeclaration, Expression, ObjectExpression, Statement } from 'estree-jsx';

import DataExtractor from './data';
import ComputedExtractor from './computed';
import WatchExtractor from './watch';
import MethodsExtractor from './methods';
import { IExtractedDependencies } from '../interfaces';

const COMPONENT_PROPERTY = {
  NAME: 'name',
  PROPS: 'props',
  DATA: 'data',
  COMPUTED: 'computed',
  WATCH: 'watch',
  METHODS: 'methods',
  RENDER: 'render',
};

export default class Extractor {
  private nodes: {
    props: ObjectExpression;
    data: ObjectExpression;
    computed: ObjectExpression;
    watch: ObjectExpression;
    methods: ObjectExpression;
    render: Expression;
  };

  private name: string;
  constructor(ast: BaseNode) {
    this.nodes = {
      props: null,
      data: null,
      computed: null,
      watch: null,
      methods: null,
      render: null,
    };

    this.extractProperties(ast);
  }

  private setNode<T>(type: string, node: T) {
    this.nodes[type] = node;
  }

  private setName(name: string) {
    this.name = name;
  }

  private isRenderBody(body: Statement[]): boolean {
    if (body.length !== 1) {
      return false;
    }

    return body[0].type === 'ReturnStatement';
  }

  private extractProperties(ast: BaseNode) {
    const self = this;

    walk(ast, {
      enter(node) {
        if (node.type === 'ExportDefaultDeclaration') {
          const { declaration } = node as ExportDefaultDeclaration;

          if (declaration.type === 'ObjectExpression') {
            declaration.properties.forEach((property) => {
              if (property.type === 'Property' && property.key.type === 'Identifier') {
                switch (property.key.name) {
                  case COMPONENT_PROPERTY.NAME:
                    if (property.value.type === 'Literal' && typeof property.value.value === 'string') {
                      self.setName(property.value.value);
                    }
                    break;

                  case COMPONENT_PROPERTY.PROPS:
                    if (property.value.type === 'ObjectExpression') {
                      self.setNode(COMPONENT_PROPERTY.PROPS, property.value);
                    }

                    break;

                  case COMPONENT_PROPERTY.DATA:
                    if (property.value.type === 'ObjectExpression') {
                      self.setNode(COMPONENT_PROPERTY.DATA, property.value);
                    }

                    break;

                  case COMPONENT_PROPERTY.COMPUTED:
                    if (property.value.type === 'ObjectExpression') {
                      self.setNode(COMPONENT_PROPERTY.COMPUTED, property.value);
                    }

                    break;

                  case COMPONENT_PROPERTY.WATCH:
                    if (property.value.type === 'ObjectExpression') {
                      self.setNode(COMPONENT_PROPERTY.WATCH, property.value);
                    }

                    break;

                  case COMPONENT_PROPERTY.METHODS:
                    if (property.value.type === 'ObjectExpression') {
                      self.setNode(COMPONENT_PROPERTY.METHODS, property.value);
                    }

                    break;

                  case COMPONENT_PROPERTY.RENDER:
                    if (property.value.type === 'FunctionExpression') {
                      const { body } = property.value;

                      if (body.body.length !== 1) {
                        return;
                      }

                      const returnNode = body.body[0];

                      if (returnNode.type === 'ReturnStatement') {
                        self.setNode(COMPONENT_PROPERTY.RENDER, returnNode.argument);
                      }
                    }

                    break;
                }
              }
            });
          }

          this.skip();
        }
      },
    });
  }

  public generateData(): { node: BaseNode[]; dependencies: IExtractedDependencies } {
    const data = new DataExtractor(this.nodes[COMPONENT_PROPERTY.DATA]);

    const node = data.generateNode();
    const dependencies = data.getDependencies();

    return {
      node,
      dependencies,
    };
  }

  public generateComputed(): { node: BaseNode[]; dependencies: IExtractedDependencies } {
    const data = new ComputedExtractor(this.nodes[COMPONENT_PROPERTY.COMPUTED]);

    const node = data.generateNode();
    const dependencies = data.getDependencies();

    return {
      node,
      dependencies,
    };
  }

  public generateMethods(dependencies: Record<string, boolean>): { node: BaseNode[] } {
    const data = new MethodsExtractor(this.nodes[COMPONENT_PROPERTY.METHODS], dependencies);
    const node = data.generateNode();

    return { node };
  }

  public generateWatch(): { node: BaseNode[] } {
    const data = new WatchExtractor(this.nodes[COMPONENT_PROPERTY.WATCH]);
    const node = data.generateNode();

    return { node };
  }

  public getRenderNode(): BaseNode {
    return this.nodes[COMPONENT_PROPERTY.RENDER];
  }

  public getComponentName(): string {
    return this.name;
  }
}
