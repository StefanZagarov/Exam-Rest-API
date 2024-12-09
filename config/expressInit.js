import express from 'express';
import cookieParser from 'cookie-parser';
import { JWT_SECRET } from '../constants.js';

export default function expressInit(app)
{
    // TODO: Check how this works, may cause problems with css files if implemented wrongly - this may do nothing as this works for the back end server only i think
    // app.use(express.static(`css`));

    app.use(express.json());

    app.use(cookieParser(JWT_SECRET));
}