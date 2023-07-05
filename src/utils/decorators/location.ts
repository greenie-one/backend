export function IPLocation() {
  return function (target: unknown, property: string, index: number): void {
    Reflect.defineMetadata('fastify:method:user_location', { index }, target, property);
  };
}
