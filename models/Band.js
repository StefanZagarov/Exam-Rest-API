import { Schema, Types, model } from 'mongoose';

const bandSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    origin: {
        type: String,
        required: true
    },
    genres: {
        type: String,
        required: true
    },
    members: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    createdBy: {
        type: Types.ObjectId,
        ref: `User`
    },
    likes: [{
        type: Types.ObjectId,
        ref: `User`
    }]
});

const Band = model(`Band`, bandSchema);

export default Band;