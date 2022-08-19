import { TypesEnum } from "@decorators/types.decorator";

export interface LoginModel {
    status: boolean;
    id?: string;
    username?: string;
    type?: TypesEnum;
    message?: string;
}