import express from 'express'
import { MikroORM } from '@mikro-orm/postgresql';
import dotenv from 'dotenv';

import indexRouter from './routes/index.js';
import usersRouter from './routes/users.js';
import constituentRouter from './routes/constituents.js';
import config from './mikro-orm.config.js';

// Temporarily creating a user here prior to creating migration
// TODO: Remove when migrations are implemented
import bcrypt from 'bcrypt';
import { User } from './models/index.js';

dotenv.config();

const app = express();
const port = process.env.PORT;

// TODO: Remove when migrations are implemented
const saltRounds = process.env.SALT_ROUNDS || "10";

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/constituents', constituentRouter);

const orm = await MikroORM.init(config);

await orm.schema.refreshDatabase();

export const em = orm.em.fork();

// TODO: Remove when migrations are implemented
const user = new User();
user.email = 'foo@bar.com';
user.firstName = 'Test';
user.lastName = 'User';
user.password = await bcrypt.hash('testing', parseInt(saltRounds));
em.persist(user);
await em.flush();

app.listen(port, () => {
  // Log a message when the server is successfully running
  console.log(`Server is running on http://localhost:${port}`);
});
