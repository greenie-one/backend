export function AuthGuard() {
  return function (target: unknown, property?: string) {
    const existingHandlers: string[] = Reflect.getMetadata('fastify:auth', target) ?? [];
    existingHandlers.push(property);
    Reflect.defineMetadata('fastify:auth', existingHandlers, target);
  };
}
