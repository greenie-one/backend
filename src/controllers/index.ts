import { FastifyInstance } from 'fastify';
import RootController from './root.controller';
import UserController from './users.controller';

function validateRoute(route: string) {
  const replaced = route.replaceAll(/\/+/g, '/');
  if (replaced.endsWith('/')) return replaced.substring(0, replaced.length - 1);
  return replaced;
}

export function registerControllers(fastify: FastifyInstance) {
  const controllers = [RootController, UserController];

  for (const c of controllers) {
    const baseRoute = Reflect.getMetadata('fastify:controller', c)?.route ?? '/';
    const controllerInstance = new c();

    const methods: Set<TargetMetadata> = Reflect.getMetadata('fastify:methods', controllerInstance);

    for (const method of methods) {
      const routeProps = {
        method: method.method,
        handler: controllerInstance[method.property].bind(controllerInstance),
        url: validateRoute(`${baseRoute}/${method.url}`),
      };

      fastify.route(routeProps);

      console.info(`Mapped ${routeProps.url} to [${c.name}.${method.property}]`);
    }
  }
  return controllers;
}
