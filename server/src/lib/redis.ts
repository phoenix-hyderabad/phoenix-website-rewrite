import redis from "redis";
import logger from "./logger";
import { REDIS_URL } from "@/config/environment";

// Create a Redis client
const client = redis.createClient({
    url: REDIS_URL,
});

void client.connect().catch();

// Handle connection events
client.on("connect", () => {
    logger.info("Connected to Redis");
});

client.on("error", (error) => {
    logger.error(`Error connecting to Redis: ${error}`);
    process.exit(1);
});

client.on("end", () => {
    logger.info("Disconnected from Redis");
});

export default client;
