import { IsNotEmpty, IsString } from 'class-validator';

export class GPScompareDto {
  @IsString()
  @IsNotEmpty()
  public GPS: string;
}

