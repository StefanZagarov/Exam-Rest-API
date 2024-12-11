import { AUTH_COOKIE_NAME, JWT_SECRET } from "../constants.js";
import Song from "../models/Song.js";
import jwt from 'jsonwebtoken';
import Comment from "../models/Comment.js";


async function createSong(req, res)
{
    let { albumImage, name, genres, band, length } = req.body;

    try
    {
        // TODO: Maybe change to getting req.user._id after implementing auth middleware
        // Get user by cookie
        const token = req.cookies[AUTH_COOKIE_NAME];
        const decodedToken = jwt.verify(token, JWT_SECRET);

        let newSong = await Song.create({ albumImage, name, genres, band, length, createdBy: decodedToken._id, likes: [] });

        res.status(200).send(newSong);
    }
    catch (error)
    {
        res.status(409).send(error);
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
        res.status(409).send(error);
    }
}

async function getAllSongsByLikes(req, res,)
{
    try
    {
        const allSongs = await Song.find().populate(`createdBy`);

        const songsByLikes = allSongs.sort((a, b) => b.likes.length - a.likes.length);

        res.status(200).send(songsByLikes);
    }
    catch (error)
    {
        res.status(409).send(error);
    }
}

async function getSong(req, res)
{
    // Because of `activatedRoute.snapshot.params[`songId`]` we send a params and not a body property
    const { songId } = req.params;

    try
    {
        const song = await Song.findById(songId).populate(`createdBy`).populate(`comments`).populate({
            path: `comments`,
            populate: { path: `creator` }
        });

        res.status(200).send(song);
    }
    catch (error)
    {
        res.status(409).send(error);
    }
}

async function updateSong(req, res)
{
    const { songId } = req.params;
    const { albumImage, name, genres, band, length } = req.body;
    let updatedSong = {};

    try
    {
        const song = await Song.findById(songId);

        if (song.name !== name)
        {
            updatedSong = await Song.findByIdAndUpdate({ _id: songId }, { albumImage, name, genres, band, length, likes: [] }, { runValidators: true, new: true });
        }
        else
        {
            updatedSong = await Song.findByIdAndUpdate({ _id: songId }, { albumImage, name, genres, band, length }, { runValidators: true, new: true });
        }

        res.status(200).send(updatedSong);
    }
    catch (error)
    {
        res.status(409).send(error);
    }
}

async function likeSong(req, res)
{
    const { songId } = req.params;
    const { userId } = req.body;

    try
    {
        await Song.findByIdAndUpdate(songId, { $push: { likes: userId } });

        res.status(200).end();
    }
    catch (error)
    {
        res.status(409).end();
    }
}

async function unlikeSong(req, res)
{
    const { songId } = req.params;
    const { userId } = req.body;

    try
    {
        await Song.findByIdAndUpdate(songId, { $pull: { likes: userId } });

        res.status(200).end();
    }
    catch (error)
    {
        res.status(409).end();
    }
}

async function addComment(req, res)
{
    const { songId } = req.params;
    const { comment } = req.body;

    try
    {
        const commentModel = await Comment.create(comment);

        // await Song.findByIdAndUpdate(songId, { $push: { comments: commentModel } });
        await Song.findByIdAndUpdate(songId, { $push: { comments: { $each: [commentModel], $position: 0 } } });

        res.status(200).end();
    }
    catch (error)
    {
        res.status(409).end();
    }
}

async function deleteComment(req, res)
{
    const { songId, commentId } = req.params;

    try
    {
        await Song.findByIdAndUpdate(songId, { $pull: { comments: commentId } });

        res.status(200).end();
    }
    catch (error)
    {
        res.status(409).end();
    }
}

async function deleteSong(req, res)
{
    const { songId } = req.params;

    try 
    {
        await Song.findByIdAndDelete(songId);

        res.status(200).end();
    }
    catch (error)
    {
        res.status(409).end();
    }
}

async function getCreatedSongs(req, res)
{
    const { userId } = req.params;

    try
    {
        const found = await Song.find({ createdBy: userId });

        res.status(200).send(found);
    }
    catch (error)
    {
        res.status(409).end;
    }
}

async function getLikedSongs(req, res)
{
    const { userId } = req.params;

    try
    {
        const found = await Song.find({ likes: userId });

        res.status(200).send(found);
    }
    catch (error)
    {
        res.status(409).end();
    }
}

export default { getAllSongs, getAllSongsByLikes, createSong, getSong, updateSong, likeSong, unlikeSong, addComment, deleteComment, deleteSong, getCreatedSongs, getLikedSongs };