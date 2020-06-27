import { BaseNode } from 'estree-jsx';
import BaseElement from './base-element';

export default abstract class BaseExpressionElement<T> extends BaseElement<T> {
  abstract generateBody(): BaseNode[];
}

export { BaseExpressionElement };
