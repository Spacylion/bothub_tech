import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const cookieHeader = request.headers['cookie'];
    const jwtToken = this.extractJwtFromCookie(cookieHeader);
    if (jwtToken) {
      request.headers['authorization'] = `Bearer ${jwtToken}`;
    }

    return super.canActivate(context);
  }

  private extractJwtFromCookie(
    cookieHeader: string | undefined,
  ): string | null {
    if (!cookieHeader) return null;
    const cookies = cookieHeader.split('; ');
    for (const cookie of cookies) {
      const [name, value] = cookie.split('=');
      if (name === 'jwt') {
        return value;
      }
    }
    return null;
  }
}
