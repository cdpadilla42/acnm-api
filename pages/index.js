import Head from 'next/head';
import Image from 'next/image';
import { connectToDatabase } from '../lib/mongodb';
import styles from '../styles/Home.module.css';

export default function Home({ count }) {
  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          {count} people have started the game since release
        </h1>
      </main>
    </div>
  );
}

export async function getServerSideProps({ params }) {
  const { db } = await connectToDatabase();
  const query = { date: { $gte: new Date('2022-09-30T01:15:01.119+00:00') } };
  const projection = { type: 1 };
  const dbRes = await db.collection('acnm').find(query, projection).count();
  const count = dbRes;

  return { props: { count } };
}
