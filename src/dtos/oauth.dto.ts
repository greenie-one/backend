import { IsString } from 'class-validator';

export class LinkedInOAuthDto {
  @IsString()
  code: string;

  @IsString()
  state: string;
}

export class LinkedInAccessTokenResponse {
  access_token: string;
  expires_in: number;
  scope: string;
  token_type: 'Bearer';
  id_token: string;
  error?: string;
  error_description?: string;
}
