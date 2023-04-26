import express,{ application, response } from 'express';
import pointsofinterestRouter from './routes/poi.mjs';
import usersRouter from './routes/users.mjs';
import 'dotenv/config';

const app = express();

app.use(express.static('public'));
app.use(express.json());

app.use('/poi', pointsofinterestRouter);
app.use('/users', usersRouter);

app.listen(3000);