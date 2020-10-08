import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { TRacl } from '../type/t.Racl';
import { intersection, some } from 'lodash';
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const racls: TRacl[] = this.reflector.get<TRacl[]>('racls', context.getHandler());
    if (!racls) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    // return this.matchRacls(racls, user);
    return true;
  }

  matchRacls(racls: TRacl[], user: any): boolean {
    const { role: { permissions } } = user;
    return some(racls, racl => (intersection(racl.permissions, permissions)))
  }
}