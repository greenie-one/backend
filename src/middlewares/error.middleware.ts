import { HttpException } from '@/exceptions/httpException';
import { FastifyReply, FastifyRequest } from 'fastify';

export const ErrorMiddleware = (error: HttpException, req: FastifyRequest, res: FastifyReply) => {
  const status: number = error.status || 500;
  const message: string = error instanceof HttpException ? error.message : 'Something went wrong';
  const code = error.code;

  console.error(`[${req.method}] ${req.routerPath} >> StatusCode:: ${status}, Code:: ${code} Message::`, error);
  res.status(status).send({ message, code });
};
