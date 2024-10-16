import { PROD } from "@/config/environment";
import logger from "@/lib/logger";
import type { CorsOptions } from "cors";

const allowedOrigins = [
    "http://phoenix-bphc.vercel.app",
    "https://phoenix-bphc.vercel.app",
];

if (!PROD) allowedOrigins.push("http://localhost:5173");

const corsOptions: CorsOptions = {
    origin: (origin, callback) => {
        // allow requests with no origin
        // (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        if (!allowedOrigins.includes(origin)) {
            logger.info("CORS policy not allowed for origin: " + origin);
            const msg =
                "The CORS policy for this site does not " +
                "allow access from the specified Origin.";
            return callback(new Error(msg), false);
        }
        return callback(null, true);
    },
};

export default corsOptions;
