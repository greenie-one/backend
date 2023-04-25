import { Type } from 'class-transformer';
import { IsDate, IsNotEmpty, IsOptional, IsString, ValidateNested } from 'class-validator';

class AddressDto {
  @IsString()
  @IsNotEmpty()
  public country: string;

  @IsString()
  @IsNotEmpty()
  public dist: string;

  @IsString()
  @IsNotEmpty()
  public state: string;

  @IsString()
  @IsNotEmpty()
  public po: string;

  @IsString()
  @IsNotEmpty()
  public vtc: string;

  @IsString()
  @IsNotEmpty()
  public subdist: string;

  @IsString()
  @IsNotEmpty()
  public house: string;

  @IsOptional()
  @IsString()
  public loc?: string;

  @IsOptional()
  @IsString()
  public street?: string;

  @IsOptional()
  @IsString()
  public landmark?: string;

  @IsString()
  public zip!: string;
}

export class AadharCardDto {
  @IsString()
  @IsNotEmpty()
  public name: string;

  @IsString()
  @IsNotEmpty()
  public aadhaar_number: string;

  @IsDate()
  @IsNotEmpty()
  public dob: string;

  @IsString()
  @IsNotEmpty()
  public gender: string;

  @ValidateNested()
  @Type(() => AddressDto)
  public address: AddressDto;

  @IsOptional()
  @IsString()
  public photo?: string;

  @IsString()
  public phone: string;
}

export class GetAadharCardDto {
  @IsString()
  @IsNotEmpty()
  public aadhaar_number: string;
}
