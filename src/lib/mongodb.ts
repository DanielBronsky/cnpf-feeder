/**
 * src/lib/mongodb.ts
 * Подключение к MongoDB + helper `getDb()`.
 *
 * - В dev переиспользуем соединение через global._mongoClientPromise, чтобы не плодить коннекты на hot-reload.
 * - В production создаём новый MongoClient на процесс.
 */
import { MongoClient } from 'mongodb';

function getMongoUri() {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error('Missing MONGODB_URI in .env.local');
  return uri;
}

declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

function getClientPromise() {
  const uri = getMongoUri();

  if (process.env.NODE_ENV === 'development') {
    if (!global._mongoClientPromise) {
      const client = new MongoClient(uri);
      global._mongoClientPromise = client.connect();
    }
    return global._mongoClientPromise!;
  }

  const client = new MongoClient(uri);
  return client.connect();
}

export async function getDb() {
  const c = await getClientPromise();
  return c.db(); // db name берётся из URI, иначе будет default
}
