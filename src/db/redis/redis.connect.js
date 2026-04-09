import { createClient } from "redis";

export const redis_client = createClient({ //redis_client جواها كل الميثود الى هقدر من خلالها اعمل set ,get ,del ,expire,....
  url: "redis://127.0.0.1:6379"
});

export const redis_connect = async () => {
  try {
    await redis_client.connect();
    console.log("Connected to Redis");
  } catch (err) {
    console.error("Error connecting to Redis", err);
  }
};

