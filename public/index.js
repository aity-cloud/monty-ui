import { MontyPlugin } from './plugin';

export function plugin(initializerContext) {
  return new MontyPlugin(initializerContext);
}
