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

async function getAllBandsByLikes(req, res, next, filter = ``)
{
    try
    {
        const allBands = await Band.find().populate(`createdBy`);

        const bandsByLikes = allBands.sort((a, b) => b.likes.length - a.likes.length);

        res.status(200).send(bandsByLikes);
    }
    catch (error)
    {
        res.status(401).send(error);
    }
}

async function getBand(req, res)
{
    // Because of `activatedRoute.snapshot.params[`bandId`]` we send a params and not a body property
    const { bandId } = req.params;

    try
    {
        const band = await Band.findById(bandId).populate(`createdBy`);
        res.status(200).send(band);
    }
    catch (error)
    {
        res.status(401).send(error);
    }
}

async function updateBand(req, res)
{
    const { bandId } = req.params;
    const { name, origin, genres, members, description } = req.body;

    try
    {
        await Band.findByIdAndUpdate({ _id: bandId }, { name, origin, genres, members, description }, { runValidators: true, new: true });

        res.status(200).end();
    }
    catch (error)
    {
        res.status(401).send(error);
    }
}

async function likeBand(req, res)
{
    const { bandId } = req.params;
    const { userId } = req.body;

    try
    {
        await Band.findByIdAndUpdate(bandId, { $push: { likes: userId } });

        res.status(200).end();
    }
    catch (error)
    {
        res.status(401).end();
    }
}

async function unlikeBand(req, res)
{
    const { bandId } = req.params;
    const { userId } = req.body;

    try
    {
        await Band.findByIdAndUpdate(bandId, { $pull: { likes: userId } });

        res.status(200).end();
    }
    catch (error)
    {
        console.log(error);
        res.status(401).end();
    }
}

export default { getAllBands, getAllBandsByLikes, createBand, getBand, updateBand, likeBand, unlikeBand };