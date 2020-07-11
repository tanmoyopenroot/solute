import { BaseNode, Expression } from 'estree-jsx';
import { b } from 'code-red';

import Chunks from './chunks';

export default class Builder {
  private chunks: Chunks;

  constructor() {
    this.chunks = new Chunks();
  }

  public addToDeclaration(code: BaseNode): void {
    this.chunks.declarations.push(code);
  }

  public addToCreate(code: BaseNode[]): void {
    this.chunks.create.push(...code);
  }

  public addToMount(code: Expression): void {
    this.chunks.mount.push(code);
  }

  public generate(name: string): BaseNode[] {
    const block = b`
      const ${name} = () => {
        ${this.chunks.declarations.map((data) => data)}

        return {
          create() {
            ${this.chunks.create.map((data) => data)}
          },
          mount() {
            ${this.chunks.mount.map((data) => data)}
          },
        }
      };
    `;

    return block;
  }
}
