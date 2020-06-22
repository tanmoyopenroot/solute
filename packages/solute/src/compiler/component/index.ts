import { walk } from 'estree-walker';
import {
  BaseNode,
  ObjectExpression,
  FunctionExpression,
  ExportDefaultDeclaration,
  Expression,
} from 'estree-jsx';

import Block from '../block';

const DEFAULT_NAME = 'Anonymous Component';
const COMPONENT_PROPERTY = {
  NAME: 'name',
  PROPS: 'props',
  DATA: 'data',
  COMPUTED: 'computed',
  WATCH: 'watch',
  METHODS: 'methods',
  RENDER: 'render',
};
export default class Component {
  private ast: BaseNode;
  public name: string;
  private propsAst: ObjectExpression;
  private dataAst: ObjectExpression;
  private computedAst: ObjectExpression;
  private watchAst: ObjectExpression;
  private methodsAst: ObjectExpression;
  private renderAst: FunctionExpression;
  private chunks: {
		body: Expression[];
		state: Expression[];
		computed: Expression[];
		methods: Expression[];
  }
  constructor(ast: BaseNode) {
    this.ast = ast;
    this.name = DEFAULT_NAME;

    this.parserAST();
  }

  private parserAST() {
    walk(this.ast, {
      enter: (node) => {
        if (node.type === 'ExportDefaultDeclaration') {
          const { declaration } = node as ExportDefaultDeclaration;

          if (declaration.type === 'ObjectExpression') {
            declaration.properties.forEach((property) => {
              if (property.type === 'Property' && property.key.type === 'Identifier') {
                
                switch (property.key.name) {
                  case COMPONENT_PROPERTY.NAME:
                    if (
                      property.value.type === 'Literal' &&
                      typeof property.value.value === 'string'
                    ) {
                      this.name = property.value.value;
                    }
                    break;

                  case COMPONENT_PROPERTY.PROPS:
                    if (property.value.type === 'ObjectExpression') {
                      this.propsAst = property.value;
                    }

                    break;

                  case COMPONENT_PROPERTY.DATA:
                    if (property.value.type === 'ObjectExpression') {
                      this.dataAst = property.value;
                    }

                    break;

                  case COMPONENT_PROPERTY.COMPUTED:
                    if (property.value.type === 'ObjectExpression') {
                      this.computedAst = property.value;
                    }

                    break;

                  case COMPONENT_PROPERTY.WATCH:
                    if (property.value.type === 'ObjectExpression') {
                      this.watchAst = property.value;
                    }

                    break;

                  case COMPONENT_PROPERTY.METHODS:
                    if (property.value.type === 'ObjectExpression') {
                      this.methodsAst = property.value;
                    }

                    break;

                  case COMPONENT_PROPERTY.RENDER:
                    if (property.value.type === 'FunctionExpression') {
                      this.renderAst = property.value;
                    }

                    break;
                }
              }
            });
          }
        }
      },
    });
  }

  public generate(): void {
    const block = new Block(this.renderAst);
  }
}
