export function AuthGuard() {
  return function (target: unknown, property?: string) {
    const existingHandlers: string[] = Reflect.getMetadata('fastify:auth', target) ?? [];
    existingHandlers.push(property);
    Reflect.defineMetadata('fastify:auth', existingHandlers, target);
  };
}

export function UserDetails() {
  return function (target: unknown, property: string, index: number): void {
    Reflect.defineMetadata('fastify:method:user_details', { index }, target, property);
  };
}
