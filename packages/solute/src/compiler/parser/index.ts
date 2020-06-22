import * as JSX from 'acorn-jsx';
import {
  Parser,
  Options,
} from 'acorn';

export default Parser.extend(JSX());
export type TOption = Options;