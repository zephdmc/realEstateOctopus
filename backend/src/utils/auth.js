import jwt from 'jsonwebtoken';
import appConfig from '../config/app.js';

// Generate JWT token
export const generateToken = (userId) => {
  return jwt.sign(
    { id: userId },
    appConfig.security.jwt.secret,
    {
      expiresIn: appConfig.security.jwt.expiresIn,
      issuer: appConfig.security.jwt.issuer,
      audience: appConfig.security.jwt.audience
    }
  );
};

// Verify JWT token
export const verifyToken = (token) => {
  return jwt.verify(token, appConfig.security.jwt.secret, {
    issuer: appConfig.security.jwt.issuer,
    audience: appConfig.security.jwt.audience
  });
};

// Decode token without verification (for inspection)
export const decodeToken = (token) => {
  return jwt.decode(token);
};