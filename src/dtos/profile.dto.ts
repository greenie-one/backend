import { IsArray, IsEnum, IsNotEmpty, IsString, ValidateIf } from 'class-validator';

export enum ProfileChangedEntity {
  NAME = 'NAME',
  DESCRIPTION_TAGS = 'DESCRIPTION_TAGS',
}

export class CreateProfileDto {
  @IsString()
  @IsNotEmpty()
  public firstName: string;

  @IsString()
  @IsNotEmpty()
  public lastName: string;

  @IsArray()
  @IsString({ each: true })
  public descriptionTags: string[];
}

export class UpdateProfileDto {
  @IsEnum(ProfileChangedEntity)
  changedEntity: ProfileChangedEntity;

  @IsString()
  @ValidateIf((obj) => obj.changedEntity === ProfileChangedEntity.NAME)
  public firstName?: string;

  @IsString()
  @ValidateIf((obj) => obj.changedEntity === ProfileChangedEntity.NAME)
  public lastName?: string;

  @IsString()
  public greenieId?: string;

  @IsArray()
  @IsString({ each: true })
  @ValidateIf((obj) => obj.changedEntity === ProfileChangedEntity.DESCRIPTION_TAGS)
  public descriptionTags: string[];
}
