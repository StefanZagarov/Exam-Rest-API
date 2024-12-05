import express from 'express';
import cors from 'cors';
import mongooseInit from "./config/mongooseInit.js";
import expressInit from './config/expressInit.js';
import router from './routes/index.js';
import auth from './middlewares/auth.js';

const port = 3000;
const app = express();

expressInit(app);
mongooseInit();

app.use(cors({
    origin: 'http://localhost:4200',
    credentials: true
}));

// Not useful for now
// app.use(auth);

app.use(`/api`, router);

app.listen(port, console.log(`Server is running on port http://localhost:${port}/...`));