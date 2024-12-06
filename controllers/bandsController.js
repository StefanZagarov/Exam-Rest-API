import { AUTH_COOKIE_NAME, JWT_SECRET } from "../constants.js";
import Band from "../models/Band.js";
import jwt from 'jsonwebtoken';


async function createBand(req, res)
{
    let { name, origin, genres, members, description } = req.body;

    try
    {
        const band = await Band.findOne({ name: name });

        if (band)
        {
            res.status(409).send(`Band has already been added!`);
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
        res.status(401).send(error);
    }
}

async function getAllBands(req, res, next, filter = ``)
{
    try
    {
        const query = await Band.find().populate(`createdBy`);

        if (filter.name)
        {
            query.find({ name: { $regex: filter.name, $options: `i` } });
        }

        if (filter.genre)
        {
            query.find({ platform: filter.platform });
        }

        res.status(200).send(query);
    }
    catch (error)
    {
        res.status(401).send(error);
    }

}

// function capitalizeWord(input)
// {
//     return input
//         .split(' ')
//         .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
//         .join(' ');
// }

export default { getAllBands, createBand };