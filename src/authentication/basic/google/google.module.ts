import { Inject, Logger, Module } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { OAuth2Client } from 'google-auth-library';
import googleConfig from 'src/config/google.config';
import { PrismaModule } from '../../prisma/prisma.module';
import { AuthTokenModule } from '../core/auth-token/auth-token.module';
import { GoogleController } from './google.controller';
import { GoogleService } from './google.service';
import { GoogleStrategy } from './google.strategy';

@Module({
  imports: [PassportModule.register({}), PrismaModule, AuthTokenModule],
  controllers: [GoogleController],
  providers: [
    GoogleStrategy,
    GoogleService,
    {
      provide: OAuth2Client,
      inject: [googleConfig.KEY],
      useFactory: (googleConf: ConfigType<typeof googleConfig>) =>
        new OAuth2Client(googleConf.oauth.clientId),
    },
  ],
})
export class GoogleModule {
  private readonly logger = new Logger('GoogleModule', { timestamp: true });
  constructor(
    @Inject(googleConfig.KEY)
    private readonly googleConf: ConfigType<typeof googleConfig>,
  ) {
    if (!googleConf.oauth.enabled) {
      this.logger.error(
        "Google OAuth was marked as disabled but GoogleModule is still present; Please remove it from AuthModule's Imports",
      );
    }
  }
}
