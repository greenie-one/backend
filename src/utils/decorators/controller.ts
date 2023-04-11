export function Controller(route?: string): (target: unknown) => void {
  return function (target: unknown) {
    Reflect.defineMetadata('fastify:controller', { route: route || '/' }, target);
  };
}
