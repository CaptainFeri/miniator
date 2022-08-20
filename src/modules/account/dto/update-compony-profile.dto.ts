import { IsNotEmpty, IsString } from "class-validator";

export class UpdateCompanyProfileDto {
    @IsString()
    @IsNotEmpty()
    readonly economicCode: string = '';

    @IsString()
    @IsNotEmpty()
    readonly registrationId: string = '';

    @IsString()
    @IsNotEmpty()
    readonly phone: string = '';

    @IsString()
    @IsNotEmpty()
    readonly activityField: string = '';

}