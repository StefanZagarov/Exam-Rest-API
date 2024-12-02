import { connect } from 'mongoose';

const dbUrl = `mongodb://localhost:27017`;

export default async function mongooseInit()
{
    try
    {
        connect(dbUrl, { dbName: `distortion-pit` });

        console.log(`Connected to DB`);
    }
    catch (error)
    {
        console.log(`Failed to connect to DB: ${error}`);
    }
}