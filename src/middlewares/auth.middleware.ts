import { StatusCodes } from 'http-status-codes';
import { Context, Next } from 'koa';
import { getTokenCookie } from '../utils/cookies.util';
import { verifyAccessToken } from '../utils/jwt.util';

export const verifyAuthentication = async (ctx: Context, next: Next) => {
  const accessToken = getTokenCookie(ctx.cookies);
  
  // Check if there is the token cookie
  if (!accessToken) {
    ctx.status = StatusCodes.UNAUTHORIZED;
    return;
  }

  // Verify the token
  try {
    verifyAccessToken(accessToken);
  } catch (error) {
    ctx.status = StatusCodes.UNAUTHORIZED;
    return;
  }

  await next();
};
