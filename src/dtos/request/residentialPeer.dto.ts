import { IsNotEmpty, IsNumber } from "class-validator";

export class GetCoordinatesDto{
  @IsNumber()
  @IsNotEmpty()
  public latitude!: Number;

  @IsNumber()
  @IsNotEmpty()
  public longitude!: Number;
}