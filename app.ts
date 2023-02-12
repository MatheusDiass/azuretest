import express from 'express';
import dotenv from 'dotenv';

dotenv.config({ path: './.env.development' });

const port = process.env.PORT || 3000;
const app = express();

app.listen(port, () => {
    console.log(`Running on: http://localhost:${port}`);
});