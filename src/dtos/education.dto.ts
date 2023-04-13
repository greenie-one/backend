import { IsDate, IsNotEmpty, IsString } from 'class-validator';

export class CreateEducationHistoryDto {
  @IsString()
  @IsNotEmpty()
  public institution!: string;

  @IsString()
  @IsNotEmpty()
  public degree!: string;

  @IsString()
  @IsNotEmpty()
  public fieldOfStudy!: string;

  @IsNotEmpty()
  @IsDate()
  public startDate?: Date;

  @IsNotEmpty()
  @IsDate()
  public endDate?: Date;
}

export class UpdateEducationHistoryDto {
  @IsString()
  public institution?: string;

  @IsString()
  public degree?: string;

  @IsString()
  public fieldOfStudy?: string;

  @IsDate()
  public startDate?: Date;

  @IsDate()
  public endDate?: Date;
}
