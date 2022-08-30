import { getSchemaPath } from "@nestjs/swagger";
import AccountEntity from "@entities/account.entity";

export const GET_PROFILE = {
    schema: {
        type: 'object',
        properties: {
            data: {
                $ref: getSchemaPath(AccountEntity),
            },
        },
    },
    description: '200. Success. Returns a account',
}

export const DELETE_ACCOUNT = {
    description: '200, Success',
}

export const UPDATE_ACCOUNT = {
    description: '200, Success',
}