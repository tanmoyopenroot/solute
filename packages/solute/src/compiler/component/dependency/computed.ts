import { IExtractedDependencies } from '../interfaces';

export default class ComputedDependency {
  private computedDependencies: Record<string, boolean>;

  constructor(dependencies: IExtractedDependencies) {
    this.computedDependencies = {};

    this.createPropertyMap(Object.keys(dependencies.properties));
  }

  public get(): Record<string, boolean> {
    return this.computedDependencies;
  }

  private createPropertyMap(properties: string[]) {
    properties.forEach((property) => (this.computedDependencies[property] = true));
  }
}
