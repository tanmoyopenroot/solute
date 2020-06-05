import Parser, { Node, Options } from '../parser';

const defaultOptions = {
  allowImportExportEverywhere: true,
};
export default (
  source: string,
  options: Options = defaultOptions,
): Node => {
  return Parser.parse(source, options);
};
