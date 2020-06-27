import { BaseNode } from 'estree-jsx';

import Component from '../component';
import Parser, { TOption } from '../parser';

const defaultOptions = {
  allowImportExportEverywhere: true,
};
export default (source: string, options: TOption = defaultOptions): BaseNode[] => {
  const ast = Parser.parse(source, options);
  const component = new Component(ast);

  return component.generate();
};
