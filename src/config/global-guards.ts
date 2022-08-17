import { INestApplication } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Reflector } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { BasicAuthGuard } from "src/shared/guards/basic-auth.guard";
import JwtAccessGuard from "src/shared/guards/jwt-access.guard";

export function useGlobalGuards(app: INestApplication) {
    const configService = app.get(ConfigService);
    const reflector = app.get(Reflector);
    app.useGlobalGuards(
        new BasicAuthGuard(configService),
        new JwtAccessGuard(reflector, configService),
    );
}