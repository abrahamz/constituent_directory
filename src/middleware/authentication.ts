import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const tokenSecret = process.env.TOKEN_SECRET || 'IfThisIsHitWeAreDoomed'

export function authenticateToken(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1] || '';

  if (token === '') {
    res.sendStatus(401)
    return;
  }

  jwt.verify(token, tokenSecret, (err: any) => {
    console.log(err);

    if (err) {
      res.sendStatus(403);
      return;
    }

    next();
  })
}
