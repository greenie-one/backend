import { UserRoles } from '@/models/users.model';
import { IsBoolean, IsEmail, IsEnum, IsOptional, IsString, IsUUID } from 'class-validator';

export class TokenClaims {
  @IsEmail()
  email: string;

  @IsUUID(4)
  sessionId: string;

  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsEnum(UserRoles, { each: true })
  roles: UserRoles[];

  @IsOptional()
  iat?: number;

  @IsBoolean()
  @IsOptional()
  isRefresh?: boolean;

  @IsString()
  userId: string;
}
