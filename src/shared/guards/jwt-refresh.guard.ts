import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';

// @Injectable()
// export default class JwtRefreshGuard extends AuthGuard('refreshToken') {}


export default class JwtRefreshGuard implements CanActivate {

    constructor(private jwtService: JwtService) {

    }

    getRequest(context: ExecutionContext) {
        return context.switchToRpc().getContext();
    }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = this.getRequest(context);
        // console.log(request.refreshToken);
        const type = context.getType();
        const prefix = 'Bearer ';

        let header: any;
        if (type === 'rpc') {
            const refreshToken = context.getArgByIndex(0)['refreshToken'];
            const status = this.jwtService.verify(refreshToken.split(' ')[1]);
            console.log(status);
        }

        return true;
    }
}