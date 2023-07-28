import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class GetCoordinatesDto {
  @IsNumber()
  @IsNotEmpty()
  public latitude!: Number;

  @IsNumber()
  @IsNotEmpty()
  public longitude!: Number;
}

export class GPScompare {
  @IsString()
  @IsNotEmpty()
  public GPS: string;
}
