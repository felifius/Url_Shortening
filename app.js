import express from 'express';
import urlRoute from './routes/urlroute.js';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use('', urlRoute);


app.listen(PORT, () => {
  console.log(`Server esta rondado na porta ${PORT}`);
});