import { PartialType } from '@nestjs/mapped-types';
import { IsBoolean, IsOptional } from 'class-validator';
import { SignUpDto } from '@/auth/dto/sign-up.dto';

export class UpdateAccountDto extends PartialType(SignUpDto) {
  @IsOptional()
  @IsBoolean()
  readonly verified?: boolean = false;
}
