import { IsBoolean, IsEmail, IsEnum, IsOptional, IsString, IsUUID } from 'class-validator';

export enum UserRoles {
  DEFAULT = 'default',
  INTERNAL = 'internal',
}

export class TokenClaims {
  @IsEmail()
  @IsOptional()
  email: string;

  @IsUUID(4)
  session_id: string;

  @IsString()
  @IsOptional()
  firstName: string;

  @IsString()
  @IsOptional()
  lastName: string;

  @IsEnum(UserRoles, { each: true })
  roles: UserRoles[];

  @IsOptional()
  iat?: number;

  @IsOptional()
  iss?: string;

  @IsBoolean()
  @IsOptional()
  is_refresh?: boolean;

  @IsString()
  sub: string;
}
