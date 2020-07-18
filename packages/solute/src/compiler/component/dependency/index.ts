import { IExtractedDependencies } from '../interfaces';
import DataDependency from './data';
import ComputedDependency from './computed';

export default class Dependency {
  private dependencyObjects: {
    data?: DataDependency;
    computed?: ComputedDependency;
  };

  constructor(dependencyList: IExtractedDependencies[]) {
    this.dependencyObjects = {};

    this.createDependencyObjects(dependencyList);
  }

  private createDependencyObjects(dependencyList: IExtractedDependencies[]): void {
    dependencyList.forEach((dependency) => {
      switch (dependency.type) {
        case 'data':
          this.dependencyObjects.data = new DataDependency(dependency);
          break;

        case 'computed':
          this.dependencyObjects.computed = new ComputedDependency(dependency);
          break;
      }
    });
  }

  public get(): Record<string, boolean> {
    return {
      ...this.dependencyObjects.data.get(),
      ...this.dependencyObjects.computed.get(),
    };
  }
}
