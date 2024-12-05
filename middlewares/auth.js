import { AUTH_COOKIE_NAME, JWT_SECRET } from "../constants.js";
import jwt from 'jsonwebtoken';
import User from "../models/User.js";

export default async function auth(req, res, next)
{
    const token = req.cookies[AUTH_COOKIE_NAME];

    if (!token) return next();

    try
    {
        const decodedToken = jwt.verify(token, JWT_SECRET);

        console.log(decodedToken);

        const user = await User.findById(decodedToken._id);

        req.user = user;

        next();
    }
    catch (error)
    {
        res.clearCookie(AUTH_COOKIE_NAME);
    }
}