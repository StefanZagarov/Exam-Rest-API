import { AUTH_COOKIE_NAME } from '../constants.js';
import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../constants.js';
import bcrypt from 'bcrypt';

async function register(req, res)
{
    const { username, email, password, rePassword } = req.body;

    try 
    {
        const user = await User.findOne({ $or: [{ username }, { email }] });

        if (user)
        {
            res.status(409).send({ message: `This username or email is already registered!` });
            return;
        }

        if (password !== rePassword)
        {
            res.status(409).send({ message: `Password mismatch!` });
            return;
        }

        const newUser = await User.create({ username, email, password });

        const token = generateToken(newUser);

        res.cookie(AUTH_COOKIE_NAME, token, { httpOnly: true, sameSite: 'none', secure: true });

        res.status(200).send(newUser);
    }
    catch (error)
    {
        res.send(error);
    }
};

async function login(req, res)
{
    const { username, password } = req.body;

    try 
    {
        const user = await User.findOne({ username });

        if (!user)
        {
            res.status(401).send({ message: 'Wrong email or password' });
            return;
        }

        const isValidPass = await bcrypt.compare(password, user.password);

        if (!isValidPass)
        {
            res.status(401).send({ message: 'Wrong email or password' });
            return;
        }

        const token = generateToken(user);

        res.cookie(AUTH_COOKIE_NAME, token, { httpOnly: true, sameSite: 'none', secure: true });

        res.status(200).send(user);
    }
    catch (error)
    {
        res.send(error);
    }
}

function logout(req, res)
{
    try
    {
        res.clearCookie(AUTH_COOKIE_NAME);
    }
    catch (error)
    {
        res.send(error.message);
    }
}

function generateToken(user)
{
    const payload = {
        _id: user._id,
        username: user.username,
    };

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: `1d` });

    return token;
}

export default { register, login, logout };