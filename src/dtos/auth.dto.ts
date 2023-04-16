import { UserRoles } from '@/models/users.model';
import { IsBoolean, IsEmail, IsEnum, IsString, IsUUID } from 'class-validator';

export class TokenClaims {
  @IsEmail()
  email: string;

  @IsUUID(4)
  sessionId: string;

  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsEnum(UserRoles)
  roles: UserRoles[];

  iat?: number;

  @IsBoolean()
  isRefresh?: boolean;
}
