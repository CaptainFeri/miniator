import { GenderEnum } from '@entities/profile.entity';
import {
  IsArray,
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsString,
} from 'class-validator';

export class UpdateProfileDto {
  @IsString()
  @IsNotEmpty()
  readonly nationalCode: string = '';

  @IsString()
  @IsNotEmpty()
  readonly firstName: string = '';

  @IsEnum(GenderEnum)
  @IsNotEmpty()
  readonly gender: GenderEnum;

  @IsString()
  @IsNotEmpty()
  readonly lastName: string = '';

  @IsString()
  @IsNotEmpty()
  readonly phone: string = '';

  @IsArray()
  @IsNotEmpty()
  readonly socilaMedia: any[];

  @IsString()
  @IsNotEmpty()
  readonly city: string = '';

  @IsString()
  @IsNotEmpty()
  readonly job: string = '';

  @IsDateString()
  @IsNotEmpty()
  readonly birthday: Date;
}
