import { ConfigService } from '@nestjs/config';
import { JwtModuleOptions } from '@nestjs/jwt';

export async function getJwtConfig(
  configSevice: ConfigService,
): Promise<JwtModuleOptions> {
  return {
    secret: configSevice.getOrThrow<string>('JWT_SECRET'),
    signOptions: {
      algorithm: 'HS512',
    },
    verifyOptions: {
      algorithms: ['HS512'],
      ignoreExpiration: false
    },
  };
}
