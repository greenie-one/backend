import { IsNotEmpty, IsString } from 'class-validator';

export class GPScompare {
  @IsString()
  @IsNotEmpty()
  public GPS: string;
}
