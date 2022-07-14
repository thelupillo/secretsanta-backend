import JWT, { Algorithm, JwtPayload, SignOptions } from 'jsonwebtoken';
import { TokenPayload } from '../types';

const algorithm: Algorithm = 'HS512';
const expiresIn: string | number = '15m';

const refreshTokenSignOptions: SignOptions = {
  algorithm
};
const accessTokenSignOptions: SignOptions = {
  algorithm,
  expiresIn
};

export const signRefreshToken = (payload: string | TokenPayload): string => {
  return JWT.sign(payload, `${process.env.JWT_REFRESH_TOKEN_KEY}`, refreshTokenSignOptions);
};

export const signAccessToken = (payload: string | TokenPayload): string => {
  return JWT.sign(payload, `${process.env.JWT_ACCESS_TOKEN_KEY}`, accessTokenSignOptions);
};

export const verifyRefreshToken = (token: string): TokenPayload | JwtPayload => {
  const payload = JWT.verify(token, `${process.env.JWT_REFRESH_TOKEN_KEY}`);
  if (typeof(payload) === 'string') return JSON.parse(payload) as TokenPayload;
  return payload;
};

export const verifyAccessToken = (token: string): TokenPayload | JwtPayload => {
  const payload = JWT.verify(token, `${process.env.JWT_ACCESS_TOKEN_KEY}`);
  if (typeof(payload) === 'string') return JSON.parse(payload) as TokenPayload;
  return payload;
};
