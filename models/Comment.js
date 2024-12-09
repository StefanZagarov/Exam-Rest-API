import { Schema, Types, model } from 'mongoose';

const commentSchema = new Schema({
    content: String,
    creator: {
        type: Types.ObjectId,
        ref: `User`
    },
    createdAt: String,
    updatedAt: String
});

const Comment = model(`Comment`, commentSchema);

export default Comment;