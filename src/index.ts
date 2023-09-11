import express from 'express';

import connection from './config/database';
import router from './router';
import cors from 'cors';

const app = express();

if (!process.env.PORT) {
  require('dotenv').config();
}
app
  .use(express.json({ limit: '50mb' }))
  .use(cors())
  .use('/api', router);

connection();
app.listen(process.env.PORT, () => {
  console.log(`Server listing on port ${process.env.PORT}`);
});
