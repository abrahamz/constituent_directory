import express, { Request, Response, NextFunction } from 'express';
import { wrap } from '@mikro-orm/postgresql';
import multer from 'multer';
import { AsyncParser } from '@json2csv/node';
import { validate } from 'class-validator';

import { em } from '../app.js';
import { Constituent, User } from '../models/index.js';
import { logger } from '../services/logger.js';
import { authenticateToken } from '../middleware/authentication.js';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

/* GET all Constituents */
router.get('/', authenticateToken, async function(req: Request, res: Response, next: NextFunction) {
  const constituents = await em.findAll(Constituent);

  res.send(constituents);
});

/* GET all Constituents */
router.get('/find/:id', authenticateToken, async function(req: Request, res: Response, next: NextFunction) {
  const id = parseInt(req.params.id);

  const constituents = await em.find(Constituent, {}, {
    filters: { electedOfficial: { belongsToId: id } }
  })

  res.send(constituents);
});

/* Create Constituent */
router.post('/', authenticateToken, async function(req: Request, res: Response, next: NextFunction) {
  try {
    const belongsToId = parseInt(req.body.belongsTo)

    if (Number.isNaN(belongsToId)) {
      res.status(400).json({ message: 'please pass a valid id for belongsTo'})
      return;
    }

    const user = await em.findOne(User, belongsToId);

    if (!user) {
      res.status(400).json({ message: 'invalid id for belongsTo'})
      return;
    }

    const constituent = new Constituent();
    constituent.firstName = req.body.firstName;
    constituent.lastName = req.body.lastName;
    constituent.email = req.body.email || null;
    constituent.street = req.body.street;
    constituent.address2 = req.body.address2;
    constituent.city = req.body.city;
    constituent.state = req.body.state;
    constituent.postalCode = req.body.postalCode;
    constituent.belongsTo = user;

    validate(constituent).then(errors => {
      if (errors.length > 0) {
        console.log('validation failed. errors: ', errors);
        res.status(400).json({ message: "Error Creating User", errors });
        return;
      }
    });

    await em.upsert(constituent);
  
    res.json(constituent);
  } catch (e: any) {
    logger.error(`error creating constituent: ${e.message}`);
    res.status(400).json({ message: "Error Creating Constituent, Please try again later" });
  }
});

/* Update Constituent */
router.patch('/:id', authenticateToken, async function(req: Request, res: Response, next: NextFunction) {
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
    logger.error(`error updating constituent: ${e.message}`);
    res.status(400).json({ message: "Error Updating Constituent, Please try again later" });
  }
});

/* Bulk Upload Constituents */
router.post('/bulk', authenticateToken, upload.single('csvFile'), async function(req: Request, res: Response) {
  if (!req.file) {
    res.status(400).json({ message: "error bulk uploading file"});
    return;
  }

  const belongsToId = parseInt(req.body.belongsTo)

  if (Number.isNaN(belongsToId)) {
    res.status(400).json({ message: 'please pass a valid id for belongsTo'})
    return;
  }

  const user = await em.findOne(User, belongsToId);

  if (!user) {
    res.status(400).json({ message: 'invalid id for belongsTo'})
    return;
  }

  try {
    const rawData = String(req.file?.buffer);
    const rawDataArray = rawData.split(/\r?\n/);
    let constituentArray: Constituent[] = [];

    for (const data of rawDataArray) {
      const dataArray = data.split(',');

      const constituent = new Constituent();
      constituent.firstName = dataArray[0];
      constituent.lastName = dataArray[1];
      constituent.email = dataArray[2];
      constituent.street = dataArray[3];
      constituent.address2 = dataArray[4];
      constituent.city = dataArray[5];
      constituent.state = dataArray[6];
      constituent.postalCode = dataArray[7];
      constituent.belongsTo = user;

      const validateErrors = await validate(constituent)

      if (validateErrors.length > 0) {
        console.log('validation failed. errors: ', validateErrors);
        continue;
      }

      constituentArray.push(constituent)
    };

    await em.upsertMany(constituentArray);
    res.send("Successful upload");
  } catch (e: any) {
    logger.error(`error bulk creating constituent: ${e.message}`);
    res.status(400).json({ message: "error bulk uploading file" });
  }
})

/* Download CSV of Constituents */
router.get('/download', authenticateToken, async function(req: Request, res: Response){
  const fields = [
    {
      label: 'First Name',
      value: 'firstName'
    },
    {
      label: 'Last Name',
      value: 'lastName'
    },
    {
      label: 'Email',
      value: 'email'
    },
    {
      label: 'Street',
      value: 'street'
    },
    {
      label: 'Address 2',
      value: 'address2'
    },
    {
      label: 'City',
      value: 'city'
    },
    {
      label: 'State',
      value: 'state'
    },
    {
      label: 'Postal Code',
      value: 'postalCode'
    }
  ]
  const parser = new AsyncParser({fields});

  const constituents = await em.findAll(Constituent);

  const csv = await parser.parse(constituents).promise();

  res.header('Content-Type', 'text/csv');
  res.attachment('constituents.csv');
  res.send(csv);
});

/* GET Constituent by id */
router.get('/:id', authenticateToken, async function(req: Request, res: Response, next: NextFunction) {
  const id = parseInt(req.params.id);

  if (Number.isNaN(id)) {
    res.status(400).json({ message: 'please pass a valid id'})
    return;
  }
  
  const constituent = await em.findOne(Constituent, parseInt(req.params.id));

  if (constituent === null) {
    logger.error(`error retrieving constituent with id: ${id}`);
    res.status(404).json({message: `constituent not found with id: ${req.params.id}`});
    return;
  }

  res.send(constituent);
});

export default router;
