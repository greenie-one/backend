export function UserDetails(roles?: string[]) {
  if (!roles) {
    roles = ['default'];
  }
  return function (target: unknown, property: string, index: number): void {
    Reflect.defineMetadata('fastify:method:user_details', { index, roles }, target, property);
  };
}
