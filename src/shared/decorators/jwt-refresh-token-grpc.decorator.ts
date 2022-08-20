import { createParamDecorator, ExecutionContext } from "@nestjs/common";

export const JwtRefreshToken = createParamDecorator(
    (data: string, context: ExecutionContext) => {
        const req = context.switchToHttp().getRequest();
        return req.user;
    },
);

export default JwtRefreshToken;

