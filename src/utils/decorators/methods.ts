import { HTTPMethods } from 'fastify';

function requestMethodFactory(method: HTTPMethods, url: string): PropertyDecorator {
  return function (target: unknown, property: string): void {
    const existingHandlers: Set<TargetMetadata> = Reflect.getMetadata('fastify:methods', target) ?? new Set();
    existingHandlers.add({ method, url, property });
    Reflect.defineMetadata('fastify:methods', existingHandlers, target);
  };
}

export function Get(route: string) {
  return requestMethodFactory('GET', route);
}

export function Post(route: string) {
  return requestMethodFactory('POST', route);
}

export function Put(route: string) {
  return requestMethodFactory('PUT', route);
}

export function Delete(route: string) {
  return requestMethodFactory('DELETE', route);
}

export function Patch(route: string) {
  return requestMethodFactory('PATCH', route);
}
