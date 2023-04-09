import { Controller, GET } from '@fastify-resty/core';

@Controller('/')
export default class RootController {
  @GET('/health-check')
  public getUsers() {
    return 'success';
  }
}
