import { BaseNode } from 'estree-jsx';
import { b } from 'code-red';

import Chunks from './chunks';

export default class Builder {
  private chunks: Chunks;

  constructor() {
    this.chunks = new Chunks();
  }

  public addToBody(code: BaseNode | BaseNode[]): void {
    Array.isArray(code) ? this.chunks.body.push(...code) : this.chunks.body.push(code);
  }

  public generate(name: string): BaseNode[] {
    const block = b`
      ${this.chunks.body.map((data) => data)}

      class ${name} extends SoluteComponent {
        constructor(options) {
          super();

          this.init(
            options,
            {
              state: getState(),
              computed: getComputed(),
              methods: getMethods(),
              watch: getWatchers()
            },
            createFragment
          );
        }
      }
    `;

    return block;
  }
}
