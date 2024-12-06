import { AUTH_COOKIE_NAME, JWT_SECRET } from "../constants.js";
import Band from "../models/Band.js";
import jwt from 'jsonwebtoken';


async function createBand(req, res)
{
    let { name, origin, genres, members, description } = req.body;
    name = capitalizeWord(name);
    origin = capitalizeWord(origin);
    genres = capitalizeWord(genres);
    members = capitalizeWord(members);

    try
    {
        const band = await Band.findOne({ name: name });

        if (band)
        {
            res.status(409).send(`Band is already added!`);
            return;
        }

        // TODO: Maybe change to getting req.user._id after implementing auth middleware
        // Get user by cookie
        const token = req.cookies[AUTH_COOKIE_NAME];
        const decodedToken = jwt.verify(token, JWT_SECRET);

        let newBand = await Band.create({ name, origin, genres, members, description, createdBy: decodedToken._id, likes: [] });

        res.status(200).send(newBand);
    }
    catch (error)
    {
        console.log(error);
        res.send(error);
    }
}

function capitalizeWord(input)
{
    return input
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');
}

export default { createBand };