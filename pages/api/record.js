// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { connectToDatabase } from '../../lib/mongodb';
import Cors from 'cors';

// Initializing the cors middleware
// You can read more about the available options here: https://github.com/expressjs/cors#configuration-options
const cors = Cors({
  methods: ['POST', 'GET', 'HEAD', 'OPTIONS'],
  origin: [
    // 'http://localhost:3001',
    'https://acmurdermystery.netlify.app',
    'https://acnewmurder.com',
  ],
  credentials: true,
  preflightContinue: true,
});

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
    const { client, db } = await connectToDatabase();
    // Process a POST request
    console.log(req.body.type);

    const myObj = {
      date: new Date(),
      type: req.body.type,
    };

    const dbRes = await db
      .collection('acnm')
      .insertOne(myObj, async function (err, res) {
        if (err) throw err;
        console.log('1 document inserted');
        await client.close();
      });

    console.log(dbRes);

    res.status(200).json({ message: 'Data recorded' });
  } else {
    res.status(200).json({ name: 'Big Chungus' });
  }

  return res;
}
