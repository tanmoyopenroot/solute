import {
  Parser,
  Node,
  Options,
} from 'acorn';
import * as JSX from 'acorn-jsx';

export {
  Node,
  Options,
};
export default Parser.extend(JSX());