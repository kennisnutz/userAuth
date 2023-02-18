import jwt from 'jsonwebtoken';
import env from '../config.js';

export default async function Auth(req, res, next) {
  try {
    //Access authorize header
    const token = req.headers.authorization.split(' ')[1];
    //retrieve details of logedin user
    const decodedToken = await jwt.verify(token, env.JWT_SECRET);
    req.user = decodedToken;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Authentication Failed' });
  }
}

export function localVariable(req, res, next) {
  req.app.locals = {
    OTP: null,
    resetSession: false,
  };
  next();
}
