import { env } from '@/config';
import { HttpException } from '@/exceptions/httpException';
import { validateRoute } from '@/utils/validation';
import jwt from '@fastify/jwt';
import { FastifyInstance, HTTPMethods } from 'fastify';
import { readFile } from 'fs/promises';

function getMethodRoutes(baseURL: string, methods: TargetMetadata[], match?: string) {
  return (
    (match ? methods.filter((val) => val.property === match) : methods)?.map((val) => ({
      url: validateRoute(`${baseURL}/${val.url}`),
      method: val.method,
    })) ?? []
  );
}

export async function registerJWTMiddleware(fastify: FastifyInstance, controllers: Controllers) {
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

  const privateKey = env('JWT_PRIVATE_KEY') ?? (await readFile(`./keys/${env('APP_ENV')}/private.pem`, { encoding: 'utf-8' }));
  const publicKey = env('JWT_PUBLIC_KEY') ?? (await readFile(`./keys/${env('APP_ENV')}/public.pem`, { encoding: 'utf-8' }));

  await fastify.register(jwt, {
    secret: {
      public: publicKey,
      private: { key: privateKey, passphrase: env('JWT_KEY_PASSPHRASE') },
    },
    sign: { algorithm: 'RS256' },
  });

  fastify.addHook('onRequest', async (req) => {
    const shouldValidate = !!routesToApplyAuthOn.find((val) => val.url === req.routerPath && val.method === req.method);
    if (shouldValidate) {
      try {
        await req.jwtVerify();
      } catch (e) {
        throw new HttpException(e?.message ?? 'Unauthorized', 401);
      }
    }
  });
}
