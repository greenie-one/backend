// import { getModelForClass, prop } from '@typegoose/typegoose';
// import { Verification } from './verified.model';

// export class ResidentialInfo {
//   @prop({ required: true })
//   public address_line_1!: string;

//   @prop({ required: true })
//   public address_line_2!: string;

//   @prop({ required: true })
//   public landmark!: string;

//   @prop({ required: true })
//   public pincode!: string;

//   @prop({ required: true })
//   public state!: string;

//   @prop({ required: true })
//   public country!: string;

//   @prop({ type: Date })
//   public start_date?: Date;

//   @prop({ type: Date })
//   public end_date?: Date;

//   @prop({ type: () => Verification })
//   public verification?: Verification;
// }

// export const ResidentialInfoModel = getModelForClass(ResidentialInfo);

import { IsDate, IsNotEmpty, IsOptional, IsString } from 'class-validator';

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
  public state!: string;

  @IsString()
  @IsNotEmpty()
  public country!: string;

  @IsDate()
  @IsOptional()
  public start_date?: Date;

  @IsDate()
  @IsOptional()
  public end_date?: Date;

  @IsString()
  @IsNotEmpty()
  public user_id!: string;
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

  @IsDate()
  @IsOptional()
  public start_date?: Date;

  @IsDate()
  @IsOptional()
  public end_date?: Date;

  @IsString()
  @IsNotEmpty()
  public residential_info_id!: string;
}
