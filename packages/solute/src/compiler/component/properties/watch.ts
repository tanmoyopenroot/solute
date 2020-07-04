import { BaseNode, ObjectExpression } from 'estree-jsx';
import { b } from 'code-red';

export default class WatchProperty {
  private node: ObjectExpression;

  constructor(node: ObjectExpression) {
    this.node = node;
  }

  public generateNode(): BaseNode[] {
    return b`
      const getWatchers = () => {
        return ${this.node || '{}'}
      }
    `;
  }
}
