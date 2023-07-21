import { IDTypeEnum } from '@/models/id.model';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class AddIDDto {
  @IsEnum(IDTypeEnum)
  @IsOptional()
  public id_type?: IDTypeEnum;

  @IsString()
  @IsOptional()
  public id_number?: string;

  @IsString()
  @IsOptional()
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

