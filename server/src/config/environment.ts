/**
|----------------------------------------------------------------------------------------|
    App Configuration
|----------------------------------------------------------------------------------------|
*/
export const ENVIRONMENT = process.env.NODE_ENV;
export const PROD = ENVIRONMENT === "production";
export const PORT = process.env.PORT;

/**
|----------------------------------------------------------------------------------------|
    Authentication Configuration
|----------------------------------------------------------------------------------------|
*/

export const SESSION_SECRET = process.env.JWT_SECRET ?? "session_secret_key";
export const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
if (!GOOGLE_CLIENT_ID) throw new Error("GOOGLE_CLIENT_ID not found in env");

/**
|----------------------------------------------------------------------------------------|
    Databases Configuration
|----------------------------------------------------------------------------------------|
*/

const defaultPort = 5432;
function normalizePort(val: string | undefined) {
    if (!val) return defaultPort;
    const port = parseInt(val, 10);
    if (isNaN(port)) return defaultPort;
    if (port >= 0) return port;
    return defaultPort;
}

export const REDIS_URL = process.env.REDIS_URL ?? "redis://localhost:6379";

export const CONFIG_PG = {
    host: process.env.DB_HOST ?? "localhost",
    user: process.env.DB_USER ?? "admin",
    password: process.env.DB_PASSWORD ?? "pass",
    port: normalizePort(process.env.DB_PORT),
    database: "phoenix",
    ssl: false,
};
