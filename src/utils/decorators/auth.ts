export function UserDetails() {
  return function (target: unknown, property: string, index: number): void {
    Reflect.defineMetadata('fastify:method:user_details', { index }, target, property);
  };
}
