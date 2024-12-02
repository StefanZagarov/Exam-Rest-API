import { Schema, model } from 'mongoose';
import bcrypt from 'bcrypt';

const SALT_ROUNDS = 10;

const userSchema = new Schema({
    username:
    {
        type: String,
        required: true,
        unique: true,
        minlength: [3, `Username should be at least 3 characters long!`],
        validate: {
            validator: (input) => { return /[a-zA-Z0-9]+/g.test(input); },
            message: input => `${input.value} must contain only latin letters and numbers!`
        }
    },
    email:
    {
        type: String,
        required: true,
        unique: true,
        validate: {
            validator: (input) => { return /[A-Za-z0-9]{3,}@(gmail|abv)\.(bg|com)/g; },
            message: input => `${input.value} must contain only latin letters and numbers, must be at least 3 characters long, contain @gmail or @abv, and end with .com or .bg!`
        }
    },
    password:
    {
        type: String,
        required: true,
        minlength: [6, `Password must be at least 6 characters long!`],
        validate: {
            validator: (input) => { return /[a-zA-Z0-9!?@#$%^&*]+/g.test(input); },
            message: input => `${input.value} must contain only latin letters, numbers, and special characters (! ? @ # $ % ^ & *)!`
        }
    }
});

userSchema.pre(`save`, async function ()
{
    const hash = await bcrypt.hash(this.password, SALT_ROUNDS);

    this.password = hash;
});

const User = model(`User`, userSchema);

export default User;