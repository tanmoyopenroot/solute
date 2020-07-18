export type ExtractedDependencyType = 'data' | 'computed';

export interface IExtractedDependencies {
  type: ExtractedDependencyType;
  properties: Record<string, string[]>;
}
