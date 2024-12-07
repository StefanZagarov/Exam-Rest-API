import { AUTH_COOKIE_NAME, JWT_SECRET } from "../constants.js";
import Song from "../models/Song.js";
import jwt from 'jsonwebtoken';


async function createSong(req, res)
{
    let { name, genres, band, length } = req.body;

    try
    {
        // TODO: Maybe change to getting req.user._id after implementing auth middleware
        // Get user by cookie
        const token = req.cookies[AUTH_COOKIE_NAME];
        const decodedToken = jwt.verify(token, JWT_SECRET);

        let newSong = await Song.create({ name, genres, band, length, createdBy: decodedToken._id, likes: [] });
        console.log(newSong);
        res.status(200).send(newSong);
    }
    catch (error)
    {
        res.status(401).send(error);
    }
}

async function getAllSongs(req, res, next, filter = ``)
{
    try
    {
        const query = await Song.find().populate(`createdBy`);

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

async function getAllSongsByLikes(req, res, next, filter = ``)
{
    try
    {
        const allSongs = await Song.find().populate(`createdBy`);

        const songsByLikes = allSongs.sort((a, b) => b.likes.length - a.likes.length);

        res.status(200).send(songsByLikes);
    }
    catch (error)
    {
        res.status(401).send(error);
    }
}

async function getSong(req, res)
{
    // Because of `activatedRoute.snapshot.params[`songId`]` we send a params and not a body property
    const { songId } = req.params;

    try
    {
        const song = await Song.findById(songId).populate(`createdBy`);
        res.status(200).send(song);
    }
    catch (error)
    {
        res.status(401).send(error);
    }
}

async function updateSong(req, res)
{
    const { songId } = req.params;
    const { name, genres, band, length } = req.body;

    try
    {
        const updatedSong = await Song.findByIdAndUpdate({ _id: songId }, { name, genres, band, length }, { runValidators: true, new: true });

        res.status(200).send(updatedSong);
    }
    catch (error)
    {
        res.status(401).send(error);
    }
}

export default { getAllSongs, getAllSongsByLikes, createSong, getSong, updateSong };