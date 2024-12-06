import { Schema, Types, model } from 'mongoose';

const bandSchema = new Schema({
    name: String,
    origin: String,
    genres: String,
    members: String,
    description: String,
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