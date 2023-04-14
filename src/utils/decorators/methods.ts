import { HTTPMethods } from 'fastify';

function requestMethodFactory(method: HTTPMethods, url: string): PropertyDecorator {
  return function (target: unknown, property: string): void {
    const existingHandlers: TargetMetadata[] = Reflect.getMetadata('fastify:methods', target) ?? [];
    existingHandlers.push({ method, url, property });
    Reflect.defineMetadata('fastify:methods', existingHandlers, target);
  };
}

export function Get(route: string) {
  return requestMethodFactory('GET', route);
}

export function Post(route: string) {
  return requestMethodFactory('POST', route);
}
