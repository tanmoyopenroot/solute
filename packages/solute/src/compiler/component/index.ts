import { BaseNode } from 'estree-jsx';

import Block from '../block';
import Builder from './builder';
import Extractor from './properties/extractor';

const DEFAULT_NAME = 'AnonymousComponent';

export default class Component {
  private name: string;
  private builder: Builder;
  private extractor: Extractor;
  private dependencies: Record<string, boolean>;

  constructor(node: BaseNode) {
    this.name = DEFAULT_NAME;
    this.builder = new Builder();
    this.extractor = new Extractor(node);

    this.generateProperties();
    this.createFragment();
  }

  private setDependencies(dependencies: Record<string, boolean>) {
    this.dependencies = {
      ...this.dependencies,
      ...dependencies,
    };
  }

  private generateProperties() {
    const data = this.extractor.generateData();
    this.setDependencies(data.dependencies);
    this.builder.addToBody(data.node);

    const computed = this.extractor.generateComputed();
    this.setDependencies(computed.dependencies);
    this.builder.addToBody(computed.node);

    const methods = this.extractor.generateMethods(this.dependencies);
    this.builder.addToBody(methods.node);

    const watch = this.extractor.generateWatch();
    this.builder.addToBody(watch.node);
  }

  private createFragment() {
    const render = this.extractor.getRenderNode();

    if (!render) {
      return;
    }

    const block = new Block(render).generate('createFragment');
    this.builder.addToBody(block);
  }

  public generate(): BaseNode[] {
    const name = this.extractor.getComponentName() || this.name;

    return this.builder.generate(name);
  }
}
