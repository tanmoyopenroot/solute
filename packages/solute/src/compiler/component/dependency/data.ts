import { IExtractedDependencies } from '../interfaces';

export default class DataDependency {
  private dataDependencies: Record<string, boolean>;

  constructor(dependencies: IExtractedDependencies) {
    this.dataDependencies = {};

    this.createPropertyMap(Object.keys(dependencies.properties));
  }

  public get(): Record<string, boolean> {
    return this.dataDependencies;
  }

  private createPropertyMap(properties: string[]) {
    properties.forEach((property) => (this.dataDependencies[property] = true));
  }
}
