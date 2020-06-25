import { BaseNode } from 'estree-jsx';
import BaseElement from './base-element';

export default abstract class BaseExpressionElement extends BaseElement {
  abstract generateBody(): BaseNode[];
}

export { BaseExpressionElement };
