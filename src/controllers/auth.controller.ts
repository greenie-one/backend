import { AuthSessionModel } from '@/models/session.model';
import { AuthGuard } from '@/utils/decorators/auth';
import { Controller } from '@/utils/decorators/controller';
import { Get, Post } from '@/utils/decorators/methods';
import { FastifyRequest } from 'fastify';

@Controller()
export class AuthController {
  @Post('/signup')
  async signup() {
    // TODO: Add to user's DB
  }

  @Get('/login')
  async login(req: FastifyRequest) {
    // Validate user
    const userDetails = {
      email: 'abcd@gmail.com',
      password: '1234',
    };

    const token = req.server.jwt.sign(userDetails);

    await AuthSessionModel.create({
      token: token,
    });

    return token;
  }

  @AuthGuard()
  @Post('/logout')
  async logout(req: FastifyRequest) {
    const token = req.query?.['token'];
    if (token) {
      await AuthSessionModel.findOneAndRemove({
        token,
      });
    }
  }
}
