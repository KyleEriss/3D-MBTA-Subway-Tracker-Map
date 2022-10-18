import express, { Request, Response, NextFunction } from 'express';
import { json } from 'body-parser';
const cors = require("cors");

import routes from './routes/routes';

const app = express();

app.use(json());
app.use(cors());


app.use('/subway', routes);

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  res.status(500).json({ message: err.message });
});

app.listen(8000);
