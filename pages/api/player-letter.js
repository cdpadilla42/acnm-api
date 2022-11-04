import { connectToDatabase } from '../../lib/mongodb';
import Cors from 'cors';

// Initializing the cors middleware
const cors = Cors({
  methods: ['POST', 'GET', 'HEAD', 'OPTIONS'],
  origin: ['https://acmurdermystery.netlify.app', 'https://acnewmurder.com'],
});

const { client, db } = await connectToDatabase();

// Helper method to wait for a middleware to execute before continuing
// And to throw an error when an error happens in a middleware
function runMiddleware(req, res, fn) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result) => {
      if (result instanceof Error) {
        return reject(result);
      }

      return resolve(result);
    });
  });
}

export default async function handler(req, res) {
  await runMiddleware(req, res, cors);

  if (req.method === 'POST') {
    const myObj = {
      date: new Date(),
      message: req.body.message,
    };

    const dbRes = await db
      .collection('playerLetters')
      .insertOne(myObj, async function (err, res) {
        if (err) throw err;
        console.log('1 document inserted');
        await client.close();
      });

    res.status(200).json({ message: 'Data recorded' });
  } else if (req.method === 'GET') {
    const dbRes = await db
      .collection('playerLetters')
      .find({})
      .toArray(async (err, result) => {
        if (err) throw err;
        console.log(result);
        await client.close();
        res.status(200).json({ messages: result });
      });
  } else {
    res.status(200).json({ name: 'Ready to record' });
  }

  return res;
}
