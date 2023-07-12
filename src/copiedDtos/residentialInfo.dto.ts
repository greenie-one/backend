import { Type } from 'class-transformer';
import { IsBoolean, IsISO8601, IsNotEmpty, IsOptional, IsString, ValidateNested } from 'class-validator';

export class AddResidentialInfoDto {
  @IsString()
  @IsNotEmpty()
  public address_line_1!: string;

  @IsString()
  @IsNotEmpty()
  public address_line_2!: string;

  @IsString()
  @IsNotEmpty()
  public landmark!: string;

  @IsString()
  @IsNotEmpty()
  public pincode!: string;

  @IsString()
  @IsNotEmpty()
  public city!: string;

  @IsString()
  @IsNotEmpty()
  public state!: string;

  @IsString()
  @IsNotEmpty()
  public country!: string;

  @IsISO8601()
  @IsOptional()
  public start_date?: Date;

  @IsISO8601()
  @IsOptional()
  public end_date?: Date;
}

export class UpdateResidentialInfoDto {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  public address_line_1?: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  public address_line_2?: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  public landmark?: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  public pincode?: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  public state?: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  public country?: string;

  @IsISO8601()
  @IsOptional()
  public start_date?: Date;

  @IsISO8601()
  @IsOptional()
  public end_date?: Date;
}

export class AddResidentialInfoResponse {
  @IsString()
  @IsOptional()
  public residentialInfoId?: string;

  @IsBoolean()
  @IsOptional()
  public success?: boolean;
}

export class FieldDto {
  @IsString()
  @IsNotEmpty()
  public residentialInfoId?: string;

  @IsString()
  @IsNotEmpty()
  public address_line_1!: string;

  @IsString()
  @IsNotEmpty()
  public address_line_2!: string;

  @IsString()
  @IsNotEmpty()
  public landmark!: string;

  @IsString()
  @IsNotEmpty()
  public pincode!: string;

  @IsString()
  @IsNotEmpty()
  public city!: string;

  @IsString()
  @IsNotEmpty()
  public state!: string;

  @IsString()
  @IsNotEmpty()
  public country!: string;

  @IsISO8601()
  @IsOptional()
  public start_date?: Date;

  @IsISO8601()
  @IsOptional()
  public end_date?: Date;
}

export class GetResidentialInfoResponse {
  @ValidateNested({ each: true })
  @Type(() => FieldDto)
  @IsOptional()
  public residentialInfos?: FieldDto[];
}
