export function Body() {
  return function (target: unknown, property: string, index: number): void {
    const data = Reflect.getMetadata('design:paramtypes', target, property);
    Reflect.defineMetadata('fastify:method:body', { type: data[index], index }, target, property);
  };
}

export function Req() {
  return function (target: unknown, property: string, index: number): void {
    Reflect.defineMetadata('fastify:method:request', { index }, target, property);
  };
}

export function Reply() {
  return function (target: unknown, property: string, index: number): void {
    Reflect.defineMetadata('fastify:method:reply', { index }, target, property);
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

export function Headers(queryName?: string) {
  return function (target: object, property: string, index: number) {
    const existingQuery: HeaderValidation[] = Reflect.getMetadata('fastify:method:headers', target, property) ?? [];
    existingQuery.push({ index, queryName });
    Reflect.defineMetadata('fastify:method:headers', existingQuery, target, property);
  };
}

export function Params(queryName?: string) {
  return function (target: object, property: string, index: number) {
    const existingQuery: ParamValidation[] = Reflect.getMetadata('fastify:method:params', target, property) ?? [];
    existingQuery.push({ index, queryName });
    Reflect.defineMetadata('fastify:method:params', existingQuery, target, property);
  };
}
