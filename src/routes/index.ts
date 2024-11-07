import express, { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import { em } from '../app.js';
import { User } from '../models/index.js';

const router = express.Router();
const tokenSecret = process.env.TOKEN_SECRET || 'IfThisIsHitWeAreDoomed'

/* GET home page. */
router.get('/', function(req: Request, res: Response, next: NextFunction) {
  res.send("Home Page");
});

router.post('/login', async function(req: Request, res: Response, next: NextFunction) {
  const user = await em.findOne(User, parseInt(req.body.id));
  const password = user?.password || '';

  const passwordMatch = await bcrypt.compare(req.body.password, password);

  if (!passwordMatch) {
    res.status(401).json({ error: 'Authentication failed' });
    return;
  }

  const token = jwt.sign({ usedId: user?.id }, tokenSecret, { expiresIn: '300s' });

  res.status(200).json({ token });
});

export default router;
