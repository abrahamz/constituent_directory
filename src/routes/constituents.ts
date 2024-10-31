import express, { Request, Response, NextFunction } from 'express';
import { wrap } from '@mikro-orm/postgresql';

import { em } from '../app.js';
import { Constituent, User } from '../models/index.js';

const router = express.Router();

/* GET all Constituents */
router.get('/', async function(req: Request, res: Response, next: NextFunction) {
  const constituents = await em.findAll(Constituent);

  res.send(constituents);
});

/* Create Constituent */
router.post('/', async function(req: Request, res: Response, next: NextFunction) {
  try {
    const belongsToId = parseInt(req.body.belongsTo)

    console.log(belongsToId)
    if (Number.isNaN(belongsToId)) {
      res.status(400).json({ message: 'please pass a valid id for belongsTo'})
      return;
    }

    const user = await em.findOne(User, belongsToId);

    const constituent = new Constituent();
    constituent.firstName = req.body.firstName;
    constituent.lastName = req.body.lastName;
    constituent.email = req.body.email;
    constituent.street = req.body.street;
    constituent.address2 = req.body.address2;
    constituent.city = req.body.city;
    constituent.state = req.body.state;
    constituent.postalCode = req.body.postalCode;
    constituent.belongsTo = user || undefined;

    em.persist(constituent);
    await em.flush();
  
    res.json(constituent);
  } catch (e: any) {
    res.status(400).json({ message: e.message, stack: e.stack });
  }
});

/* Update Constituent */
router.patch('/:id', async function(req: Request, res: Response, next: NextFunction) {
  try {
    const constituent = await em.findOne(Constituent, parseInt(req.params.id));
    
    if (constituent === null) {
      res.status(404).json({message: `constituent not found with id: ${req.params.id}`});
      return;
    } else {
      wrap(constituent).assign(req.body);
      await em.flush()

      res.send(constituent);
    }
  } catch (e: any) {
    res.status(400).json({ message: e.message, stack: e.stack });
  }
});

/* GET Constituent by id */
router.get('/:id', async function(req: Request, res: Response, next: NextFunction) {
  const id = parseInt(req.params.id);

  if (Number.isNaN(id)) {
    res.status(400).json({ message: 'please pass a valid id'})
    return;
  }
  
  const constituent = await em.findOne(Constituent, parseInt(req.params.id));

  if (constituent === null) {
    res.status(404).json({message: `constituent not found with id: ${req.params.id}`});
    return;
  }

  res.send(constituent);
});

export default router;
