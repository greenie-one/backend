import { IsEnum, IsNotEmpty, IsOptional, IsString, ValidateIf } from 'class-validator';

export enum IDTypeEnum {
  AADHAR = 'AADHAR',
  PAN = 'PAN',
  DRIVING_LICENSE = 'DRIVING_LICENSE',
}

export class AddIDDto {
  @IsEnum(IDTypeEnum)
  @IsOptional()
  public id_type?: IDTypeEnum;

  @IsString()
  @IsOptional()
  public id_number?: string;

  @IsString()
  @IsNotEmpty()
  @ValidateIf((o) => o.id_type === IDTypeEnum.DRIVING_LICENSE)
  public dob?: string;
}

export class VerifyIDDto {
  @IsString()
  @IsNotEmpty()
  public otp!: string;

  @IsString()
  @IsNotEmpty()
  public request_id!: string;

  @IsString()
  @IsNotEmpty()
  public task_id!: string;
}
