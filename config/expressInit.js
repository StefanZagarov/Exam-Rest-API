import express from 'express';
import cookieParser from 'cookie-parser';

export default function expressInit(app)
{
    // TODO: Check how this works, may cause problems with css files if implemented wrongly
    app.use(express.static(`css`));

    app.use(express.json());

    app.use(cookieParser());
}