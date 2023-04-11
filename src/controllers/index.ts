import { validateRoute } from '@/utils/validation';
import { FastifyInstance } from 'fastify';

export function registerControllers(fastify: FastifyInstance, controllers: Controllers) {
  for (const c of controllers) {
    const baseRoute = Reflect.getMetadata('fastify:controller', c.constructor)?.route ?? '/';

    const methods: Set<TargetMetadata> = Reflect.getMetadata('fastify:methods', c.instance);

    for (const method of methods) {
      const routeProps = {
        method: method.method,
        handler: c.instance[method.property].bind(c.instance),
        url: validateRoute(`${baseRoute}/${method.url}`),
      };

      fastify.route(routeProps);

      console.info(`Mapped ${routeProps.url} to [${c.constructor.name}.${method.property}]`);
    }
  }
  return controllers;
}
