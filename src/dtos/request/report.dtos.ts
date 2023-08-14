import { IsNotEmpty, IsString } from "class-validator";

export class CreateReportDto {
  @IsNotEmpty()
  @IsString()
  public email: string;

}