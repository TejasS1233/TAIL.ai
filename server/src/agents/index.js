import ExampleAgent from './exampleAgent.js';

const agents = new Map();

// Register built-in agents
agents.set('example', new ExampleAgent());

export function getAgent(name) {
  return agents.get(name);
}

export function listAgents() {
  return Array.from(agents.keys());
}
