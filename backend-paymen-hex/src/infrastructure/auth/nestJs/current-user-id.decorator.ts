import { createParamDecorator, ExecutionContext, UnauthorizedException } from '@nestjs/common';

export const CurrentUserId = createParamDecorator((_data: unknown, context: ExecutionContext): number => {
  const request = context.switchToHttp().getRequest<{ user?: { sub: number } }>();
  const sub = request.user?.sub;
  if (sub == null || Number.isNaN(Number(sub))) {
    throw new UnauthorizedException();
  }
  return Number(sub);
});
