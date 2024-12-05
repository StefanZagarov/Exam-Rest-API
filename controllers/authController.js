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
            res.status(409).send(`This username or email is already registered!`);
            return;
        }

        if (password !== rePassword)
        {
            res.status(409).send(`Password mismatch!`);
            return;
        }

        let newUser = await User.create({ username, email, password });

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
    const { email, password } = req.body;

    try 
    {
        let user = await User.findOne({ email });

        if (!user)
        {
            res.status(401).send('Wrong email or password');
            return;
        }

        const isValidPassword = await bcrypt.compare(password, user.password);

        if (!isValidPassword)
        {
            res.status(401).send('Wrong email or password');
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
        res.send(error);
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

function getUserProfile(req, res)
{
    const { _id: userId } = req.user;

    try
    {
        return User.findOne();
    }
    catch (error)
    {

    }
}

export default { register, login, logout };