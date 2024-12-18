import { model, Types, Schema } from 'mongoose';

const songSchema = new Schema({
    albumImage: String,
    name: {
        type: String,
        required: true
    },
    genres: {
        type: String,
        required: true
    },
    band: {
        type: String,
        required: true
    },
    length: {
        type: String,
        required: true
    },
    lyrics: String,
    createdBy: {
        type: Types.ObjectId,
        ref: `User`
    },
    likes: [{
        type: Types.ObjectId,
        ref: `User`
    }],
    comments: [{
        type: Types.ObjectId,
        ref: `Comment`
    }]
});

const Song = model(`Song`, songSchema);

export default Song;