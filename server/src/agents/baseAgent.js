export default class BaseAgent {
  constructor({ name = 'base', config = {} } = {}) {
    this.name = name;
    this.config = config;
  }

  async run(input) {
    throw new Error('run() not implemented');
  }

  async shutdown() {
    // optional cleanup
  }
}
