import redis from "redis";
import logger from "./logger";

// Create a Redis client
const client = redis.createClient();
void (async () => {
    await client.connect();
})();

// Handle connection events
client.on("connect", () => {
    logger.info("Connected to Redis");
});

client.on("error", (error) => {
    logger.error("Error connecting to Redis:", error);
});

client.on("end", () => {
    logger.info("Disconnected from Redis");
});

export default client;
