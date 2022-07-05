import JWT, { Algorithm, JwtPayload } from 'jsonwebtoken';

const algorithm: Algorithm = 'HS512';
const expiresIn: string | number = '15m';

export const signRefreshToken = (payload: string | object): string => {
  return JWT.sign(payload, `${process.env.JWT_REFRESH_TOKEN_KEY}`, { algorithm });
};

export const signAccessToken = (payload: string | object): string => {
  return JWT.sign(payload, `${process.env.JWT_ACCESS_TOKEN_KEY}`, { algorithm, expiresIn });
};

export const verifyRefreshToken = (token: string): string | JwtPayload => {
  return JWT.verify(token, `${process.env.JWT_REFRESH_TOKEN_KEY}`);
};

export const verifyAccessToken = (token: string): string | JwtPayload => {
  return JWT.verify(token, `${process.env.JWT_ACCESS_TOKEN_KEY}`);
};
