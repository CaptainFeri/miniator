import { IsBoolean, IsNotEmpty } from "class-validator";

export class BanAccountDto {
  @IsBoolean()
  @IsNotEmpty()
  readonly ban: boolean;
}