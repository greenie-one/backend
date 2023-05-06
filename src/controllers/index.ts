import { ErrorEnum } from '@/exceptions/errorCodes';
import { HttpException } from '@/exceptions/httpException';
import { validateRoute } from '@/utils/validation';
import { ClassConstructor, plainToClass } from 'class-transformer';
import { ValidationError, isString, validateOrReject } from 'class-validator';
import { FastifyInstance, RouteOptions } from 'fastify';

function predefinedValidation(name: string): typeof validateOrReject {
  if (name === 'String' || name === 'Number') {
    return async (val: unknown) => {
      if (!isString(val))
        throw [
          {
            constraints: [`${name} is not a string`],
          },
        ];
    };
  }

  return validateOrReject;
}

async function validate(type: ClassConstructor<unknown>, value: unknown, bodyOrQuery: 'body' | 'query') {
  if (!value) throw new HttpException(ErrorEnum.VALIDATION_ERROR, `${bodyOrQuery} must be defined`);

  try {
    const dto = plainToClass(type, value);

    const validator = predefinedValidation(type.name);
    await validator(dto as object);

    return dto;
  } catch (errors) {
    const message = errors?.map((error: ValidationError) => Object.values(error.constraints));
    throw new HttpException(ErrorEnum.VALIDATION_ERROR, message);
  }
}

export function registerControllers(fastify: FastifyInstance, controllers: Controllers) {
  for (const c of controllers) {
    const baseRoute = Reflect.getMetadata('fastify:controller', c.constructor)?.route ?? '/';

    const methods: Set<TargetMetadata> = Reflect.getMetadata('fastify:methods', c.instance);

    for (const method of methods) {
      const hasBody: BodyValidation = Reflect.getMetadata('fastify:method:body', c.instance, method.property);
      const hasQuery: QueryValidation[] = Reflect.getMetadata('fastify:method:query', c.instance, method.property) ?? [];
      const hasHeaders: HeaderValidation[] = Reflect.getMetadata('fastify:method:headers', c.instance, method.property) ?? [];
      const hasRequest: RequestValidation = Reflect.getMetadata('fastify:method:request', c.instance, method.property);
      const hasReply: RequestValidation = Reflect.getMetadata('fastify:method:reply', c.instance, method.property);
      const hasParams: ParamValidation[] = Reflect.getMetadata('fastify:method:params', c.instance, method.property) ?? [];

      const routeProps: RouteOptions = {
        method: method.method,
        handler: async (req, res) => {
          const handler = c.instance[method.property].bind(c.instance);

          const args = [];
          if (hasBody) {
            args[hasBody.index] = await validate(hasBody.type, req.body, 'body');
          }

          for (const q of hasQuery) {
            const query = q.queryName ? req.query[q.queryName] : req.query;
            if (!query) {
              throw new HttpException(ErrorEnum.VALIDATION_ERROR, `Query ${q.queryName} is missing`);
            }

            args[q.index] = await validate(q.type, query, 'query');
          }

          for (const h of hasHeaders) {
            const header = h.queryName ? req.headers[h.queryName.toLowerCase()] : req.headers;
            if (!header) {
              throw new HttpException(ErrorEnum.VALIDATION_ERROR, `Header ${h.queryName} is missing`);
            }

            args[h.index] = header;
          }

          for (const p of hasParams) {
            const params = req.params[p.queryName];
            if (!params) {
              throw new HttpException(ErrorEnum.VALIDATION_ERROR, `URL param ${p.queryName} is missing`);
            }

            args[p.index] = params;
          }

          if (hasRequest) args[hasRequest.index] = req;
          if (hasReply) args[hasReply.index] = res;

          if (args.length === 0) {
            args.push(req, res);
          }

          return handler(...args);
        },
        url: validateRoute(`${baseRoute}/${method.url}`),
      };

      fastify.route(routeProps);

      console.info(`Mapped ${routeProps.url} to [${c.constructor.name}.${method.property}]`);
    }
  }
  return controllers;
}
