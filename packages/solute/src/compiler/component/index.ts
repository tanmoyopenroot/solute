import { BaseNode } from 'estree-jsx';

import Block from '../block';
import Builder from './builder';
import Extractor from './extractor';
import Dependency from './dependency';
import { IExtractedDependencies } from './interfaces';

const DEFAULT_NAME = 'AnonymousComponent';

export default class Component {
  private name: string;
  private builder: Builder;
  private extractor: Extractor;
  private dependencies: Dependency;

  constructor(node: BaseNode) {
    this.name = DEFAULT_NAME;

    this.builder = new Builder();
    this.extractor = new Extractor(node);

    this.generateReactiveProperties();
    this.generateOtherProperties();
    this.createFragment();
  }

  private setDependencies(dataDependencies: IExtractedDependencies, computedDependencies: IExtractedDependencies) {
    this.dependencies = new Dependency([dataDependencies, computedDependencies]);
  }

  private generateReactiveProperties() {
    const data = this.extractor.generateData();
    this.addToBody(data.node);

    const computed = this.extractor.generateComputed();
    this.addToBody(computed.node);

    this.setDependencies(data.dependencies, computed.dependencies);
  }

  private generateOtherProperties() {
    const methods = this.extractor.generateMethods(this.dependencies.get());

    this.addToBody(methods.node);

    const watch = this.extractor.generateWatch();
    this.addToBody(watch.node);
  }

  private createFragment() {
    const render = this.extractor.getRenderNode();

    if (!render) {
      return;
    }

    const block = new Block(render, this).generate('createFragment');
    this.addToBody(block);
  }

  public getDependencies(): Record<string, boolean> {
    return this.dependencies.get();
  }

  public addToBody(node: BaseNode | BaseNode[]): void {
    this.builder.addToBody(node);
  }

  public generate(): BaseNode[] {
    const name = this.extractor.getComponentName() || this.name;

    return this.builder.generate(name);
  }
}
