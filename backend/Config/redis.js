import { createClient } from 'redis';

const client = createClient({
  socket: {
    host: 'localhost',
    port: 6379
  }
});

client.on('error', (err) => console.error('Redis Client Error', err));
client.on('connect', () => console.log('Redis connected'));

const connectRedis = async () => {
  try {
    await client.connect();
    console.log('Redis connected');
  } catch (error) {
    console.error('Redis connection error:', error);
  }
};

connectRedis();

export default client;
