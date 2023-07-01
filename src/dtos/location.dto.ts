import { IsString, IsNotEmpty } from 'class-validator';

export class GPScompare {
  @IsString()
  @IsNotEmpty()
  public GPS: string;
}
