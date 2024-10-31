import express, { Request, Response, NextFunction } from 'express';
import { wrap } from '@mikro-orm/postgresql';
import multer from 'multer';
import { AsyncParser } from '@json2csv/node';

import { em } from '../app.js';
import { Constituent, User } from '../models/index.js';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

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

/* Bulk Upload Consituents */
router.post('/bulk', upload.single('csvFile'), async function(req: Request, res: Response) {
  if (!req.file) {
    res.status(400).json({ message: "error bulk uploading file"});
    return;
  }

  try {
    const rawData = String(req.file?.buffer);
    const rawDataArray = rawData.split(/\r?\n/);

    for (const data of rawDataArray) {
      const dataArray = data.split(',');

      if (!dataArray[0] || !dataArray[1]) {
        //TODO: add ability to return records that fail validation;
        continue;
      }

      const constituent = new Constituent();
      constituent.firstName = dataArray[0];
      constituent.lastName = dataArray[1];
      constituent.email = dataArray[2];
      constituent.street = dataArray[3];
      constituent.address2 = dataArray[4];
      constituent.city = dataArray[5];
      constituent.state = dataArray[6];
      constituent.postalCode = dataArray[7];

      em.persist(constituent);
    };

    await em.flush();
    res.send("Successful upload");
  } catch (e: any) {
    res.status(400).json({ message: "error bulk uploading file", errorMessage: e.message });
  }
})

/* Download CSV of Constituents */
router.get('/download', async function(req: Request, res: Response){
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
