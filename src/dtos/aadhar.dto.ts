import { IsNotEmpty, IsObject, IsString } from 'class-validator';

export class AadharCardDto {
  @IsString()
  @IsNotEmpty()
  public aadhaar_number: string;

  @IsObject()
  @IsNotEmpty()
  public aadhaar_data: object;
}

export class GetAadharCardDto {
  @IsString()
  @IsNotEmpty()
  public aadhaar_number: string;
}
