import { CreateProfileDto, UpdateProfileDto } from '@/dtos/profile.dto';
import { Profile } from '@/models/profile.model';
import { Controller } from '@/utils/decorators/controller';
import { Delete, Get, Patch, Post } from '@/utils/decorators/methods';
import { ValidateDto } from '@/utils/validation';
import { ProfileService } from '@services/profile.service';
import { FastifyReply, FastifyRequest } from 'fastify';

@Controller('/profiles')
export default class ProfileController {
  public profileService: ProfileService = new ProfileService();

  @Get('/')
  public async getProfiles(req: FastifyRequest, res: FastifyReply) {
    const profiles: Profile[] = await this.profileService.findAllProfiles();
    res.status(200).send({ data: profiles, message: 'findAll' });
  }

  @Get('/:user')
  public async getProfile(req: FastifyRequest<{ Params: { user: string } }>, res: FastifyReply) {
    const user: string = req.params.user;
    const profile: Profile = await this.profileService.findProfileById(user);
    res.status(200).send({ data: profile, message: 'findOne' });
  }

  @ValidateDto(CreateProfileDto, 'body')
  @Post('/:user')
  public async createProfile(req: FastifyRequest<{ Params: { user: string }; Body: CreateProfileDto }>, res: FastifyReply) {
    const user: string = req.params.user;
    const profileData: CreateProfileDto = req.body;
    const createdProfile: Profile = await this.profileService.createProfile(user, profileData);
    res.status(201).send({ data: createdProfile, message: 'created' });
  }

  @ValidateDto(UpdateProfileDto, 'body')
  @Patch('/:user')
  public async updateProfile(req: FastifyRequest<{ Params: { user: string }; Body: UpdateProfileDto }>, res: FastifyReply) {
    const user: string = req.params.user;
    const profileData: UpdateProfileDto = req.body;
    const updatedProfile: Profile = await this.profileService.updateProfile(user, profileData);
    res.status(200).send({ data: updatedProfile, message: 'updated' });
  }

  @Delete('/:profileId')
  public async deleteProfile(req: FastifyRequest<{ Params: { user: string } }>, res: FastifyReply) {
    const user: string = req.params.user;
    await this.profileService.deleteProfile(user);
    res.status(200).send({ message: 'deleted' });
  }
}
