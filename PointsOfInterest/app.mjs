import express,{ application, response } from 'express';
import pointsofinterestRouter from './routes/poi.mjs';
import 'dotenv/config';



const app = express();

app.use(express.static('public'));
app.use(express.json());

app.post('*', (req, res, next)=>{
    console.log('POST request received.');
    next();
});

app.use('/poi', pointsofinterestRouter);

app.listen(1010);