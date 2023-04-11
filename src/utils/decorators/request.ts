export function Body() {
  return function (target: unknown, property: string, index: number): void {
    const data = Reflect.getMetadata('design:paramtypes', target, property);
    Reflect.defineMetadata('fastify:method:body', { type: data[index], index }, target, property);
  };
}

export function Query(queryName?: string) {
  return function (target: object, property: string, index: number) {
    const existingQuery: QueryValidation[] = Reflect.getMetadata('fastify:method:query', target, property) ?? [];
    const data = Reflect.getMetadata('design:paramtypes', target, property);
    existingQuery.push({ type: data[index], index, queryName });
    Reflect.defineMetadata('fastify:method:query', existingQuery, target, property);
  };
}
