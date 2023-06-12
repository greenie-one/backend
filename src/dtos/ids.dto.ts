import { IDTypeEnum } from '@/models/id.model';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';

export class AddIDDto {
  @IsEnum(IDTypeEnum)
  @IsNotEmpty()
  public id_type!: IDTypeEnum;

  @IsString()
  @IsNotEmpty()
  public id_number!: string;

  // Fields for Aadhaar verification
  @IsString()
  public request_id?: string;

  @IsString()
  public otp?: string;
}
