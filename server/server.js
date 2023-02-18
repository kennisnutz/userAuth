import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import connect from './database/connection.js';
import router from './router/route.js';

const app = express();

/** middlewares*/
app.use(express.json());
app.use(cors());
app.use(morgan('tiny'));
app.disable('x-powered-by'); //limit hackers knowledge of the stack

const port = 8080;

/**HTTP Get request */
app.get('/', (req, res) => {
  res.status(201).json('HOME GET Request');
});

/**Api routes */
app.use('/api', router);

/**Start server */
connect()
  .then(() => {
    try {
      app.listen(port, () => {
        console.log(`Connected to http://localhost:${port}`);
      });
    } catch (error) {
      console.log('Couldnt connect to database');
    }
  })
  .catch((error) => {
    console.log('Invalid database connection');
  });
