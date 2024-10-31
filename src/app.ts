import express from 'express'
import { MikroORM } from '@mikro-orm/postgresql';

import indexRouter from './routes/index.js'
import usersRouter from './routes/users.js'
import config from './mikro-orm.config.js';

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// commenting out until db entities exist
// connection can be tested using npx mikro-orm-esm debug
const orm = await MikroORM.init(config);

await orm.schema.refreshDatabase();

app.listen(port, () => {
  // Log a message when the server is successfully running
  console.log(`Server is running on http://localhost:${port}`);
});
