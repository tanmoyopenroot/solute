import { BaseNode } from 'estree-jsx';

import Block from '../block';
import Builder from './builder';
import Extractor from './properties/extractor';
import { Dependencies } from '../interfaces';

const DEFAULT_NAME = 'AnonymousComponent';

export default class Component {
  private name: string;
  private builder: Builder;
  private extractor: Extractor;
  private dependencies: Dependencies;

  constructor(node: BaseNode) {
    this.name = DEFAULT_NAME;
    this.dependencies = {
      data: {},
      computed: {},
    };

    this.builder = new Builder();
    this.extractor = new Extractor(node);

    this.generateReactiveProperties();
    this.generateOtherProperties();
    this.createFragment();
  }

  private setDependencies(dataDependencies: Record<string, boolean>, computedDependencies: Record<string, boolean>) {
    this.dependencies.data = dataDependencies;
    this.dependencies.computed = computedDependencies;
  }

  private generateReactiveProperties() {
    const data = this.extractor.generateData();
    this.addToBody(data.node);

    const computed = this.extractor.generateComputed();
    this.addToBody(computed.node);

    this.setDependencies(data.dependencies, computed.dependencies);
  }

  private generateOtherProperties() {
    const methods = this.extractor.generateMethods({
      ...this.dependencies.data,
      ...this.dependencies.computed,
    });

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

  public getDependencies(): Dependencies {
    return this.dependencies;
  }

  public addToBody(node: BaseNode | BaseNode[]): void {
    this.builder.addToBody(node);
  }

  public generate(): BaseNode[] {
    const name = this.extractor.getComponentName() || this.name;

    return this.builder.generate(name);
  }
}
