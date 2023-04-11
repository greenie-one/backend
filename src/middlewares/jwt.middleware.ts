import { HttpException } from '@/exceptions/httpException';
import { validateRoute } from '@/utils/validation';
import jwt from '@fastify/jwt';
import { FastifyInstance, HTTPMethods } from 'fastify';

function getMethodRoutes(baseURL: string, methods: TargetMetadata[], match?: string) {
  return (
    (match ? methods.filter((val) => val.property === match) : methods)?.map((val) => ({
      url: validateRoute(`${baseURL}/${val.url}`),
      method: val.method,
    })) ?? []
  );
}

export function registerJWTMiddleware(fastify: FastifyInstance, controllers: Controllers) {
  const routesToApplyAuthOn: { url: string; method: HTTPMethods }[] = [];

  for (const c of controllers) {
    const baseURL = Reflect.getMetadata('fastify:controller', c.constructor)?.route ?? '/';
    const methods: TargetMetadata[] = Reflect.getMetadata('fastify:methods', c.instance);

    const controllerRoutes: string[] = Reflect.getMetadata('fastify:auth', c.constructor) ?? [];
    if (controllerRoutes.length > 0) {
      routesToApplyAuthOn.push(...getMethodRoutes(baseURL, methods));
      continue;
    }

    const propertyRoutes: string[] = Reflect.getMetadata('fastify:auth', c.instance) ?? [];
    for (const a of propertyRoutes) {
      routesToApplyAuthOn.push(...getMethodRoutes(baseURL, methods, a));
    }
  }

  fastify.register(jwt, {
    secret: 'supersecret',
  });

  fastify.addHook('onRequest', async (req) => {
    const shouldValidate = !!routesToApplyAuthOn.find((val) => val.url === req.routerPath && val.method === req.method);
    if (shouldValidate) {
      try {
        await req.jwtVerify();
      } catch (e) {
        throw new HttpException('Unauthorized', 401);
      }
    }
  });
}
