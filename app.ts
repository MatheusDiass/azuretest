import dotenv from 'dotenv';
import { app } from './src';

dotenv.config({ path: './.env.development' });

const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.send(`My name is ${process.env.NAME}`);
});

app.listen(port, () => {
    console.log(`Running on: http://localhost:${port}`);
});