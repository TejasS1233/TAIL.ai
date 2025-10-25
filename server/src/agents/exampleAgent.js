import BaseAgent from './baseAgent.js';

export default class ExampleAgent extends BaseAgent {
  constructor(opts = {}) {
    super({ name: 'example', ...opts });
  }

  async run(input) {
    // Very small example: echo with metadata
    return {
      agent: this.name,
      input,
      output: `Echo: ${String(input).slice(0, 1024)}`,
      ts: new Date().toISOString(),
    };
  }
}
