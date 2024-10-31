import express, { Request, Response, NextFunction } from 'express';
import { wrap } from '@mikro-orm/postgresql';

import { em } from '../app.js';
import { User } from '../models/user.js';
import { logger } from '../services/logger.js';

const router = express.Router();

/* GET all Users */
router.get('/', async function(req: Request, res: Response, next: NextFunction) {
  const users = await em.findAll(User);

  res.send(users);
});

/* Create User */
router.post('/', async function(req: Request, res: Response, next: NextFunction) {
  try {
    const user = new User();
    user.firstName = req.body.firstName;
    user.lastName = req.body.lastName;
    user.email = req.body.email;
    user.password = req.body.password;

    em.persist(user);
    await em.flush();
  
    res.json(user);
  } catch (e: any) {
    logger.error(`error creating user: ${e.message}`);
    res.status(400).json({ message: "Error Creating User, Please try again later" });
  }
});

/* Update User */
router.patch('/:id', async function(req: Request, res: Response, next: NextFunction) {
  try {
    const user = await em.findOne(User, parseInt(req.params.id));
    
    if (user === null) {
      res.status(404).json({message: `user not found with id: ${req.params.id}`});
      return;
    } else {
      wrap(user).assign(req.body);
      await em.flush()

      res.send(user);
    }
  } catch (e: any) {
    logger.error(`error updating user: ${e.message}`);
    res.status(400).json({ message: "Error Updating User, Please try again later" });
  }
});

/* GET User by id */
router.get('/:id', async function(req: Request, res: Response, next: NextFunction) {
  const id = parseInt(req.params.id);

  if (Number.isNaN(id)) {
    res.status(400).json({ message: 'please pass a valid id'})
    return;
  }
  
  const user = await em.findOne(User, parseInt(req.params.id));

  if (user === null) {
    logger.error(`error retrieving user with id: ${id}`);
    res.status(404).json({message: `user not found with id: ${req.params.id}`});
    return;
  }

  res.send(user);
});

export default router;
