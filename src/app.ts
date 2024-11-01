import express from 'express'
import { MikroORM } from '@mikro-orm/postgresql';
import dotenv from 'dotenv';

import indexRouter from './routes/index.js';
import usersRouter from './routes/users.js';
import constituentRouter from './routes/constituents.js';
import config from './mikro-orm.config.js';

dotenv.config();

const app = express();
const port = process.env.PORT;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/constituents', constituentRouter);

const orm = await MikroORM.init(config);

await orm.schema.refreshDatabase();

export const em = orm.em.fork();

app.listen(port, () => {
  // Log a message when the server is successfully running
  console.log(`Server is running on http://localhost:${port}`);
});
