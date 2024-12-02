import express from 'express';
import cookieParser from 'cookie-parser';

export default function expressInit(app)
{
    app.use(express.static(`css`));

    app.use(express.json());

    app.use(cookieParser());
}