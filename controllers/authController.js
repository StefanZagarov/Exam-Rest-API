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
    const { username, password } = req.body;

    try
    {
        let user = await User.findOne({ username });

        if (!user)
        {
            res.status(401).send('Wrong username or password');
            return;
        }

        const isValidPassword = await bcrypt.compare(password, user.password);

        if (!isValidPassword)
        {
            res.status(401).send('Wrong username or password');
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
        res.clearCookie(AUTH_COOKIE_NAME).status(204).send(`Logged out!`);
    }
    catch (error)
    {
        res.send(error);
    }
}

function generateToken(user)
{
    const payload = {
        _id: user._id
    };

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: `1d` });

    return token;
}

// Acts as both user details page, and updating the navbar on page refresh 
async function getUserProfile(req, res)
{
    const token = req.cookies[AUTH_COOKIE_NAME];

    // Send status 401 so maybe we will redirect to the login page if there is no user (cookie)
    // if (!token) res.status(401).send();
    // For now just end the request without status of 401 so it doesnt go to error page
    if (!token) return res.send();

    const decodedToken = jwt.verify(token, JWT_SECRET);

    try
    {
        const user = await User.findById({ _id: decodedToken._id });

        console.log(user);

        res.status(200).send(user);
    }
    catch (error)
    {
        res.send();
    }
}

export default { register, login, logout, getUserProfile };