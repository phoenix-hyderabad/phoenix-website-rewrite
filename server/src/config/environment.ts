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

export const SESSION_SECRET = process.env.JWT_SECRET || "";
// if (!SESSION_SECRET) process.exit(1)

/**
|----------------------------------------------------------------------------------------|
    Databases Configuration
|----------------------------------------------------------------------------------------|
*/

const defaultPort = 5432;
function normalizePort(val: string | undefined) {
    if (!val) return defaultPort;
    let port = parseInt(val, 10);
    if (isNaN(port)) return defaultPort;
    if (port >= 0) return port;
    return defaultPort;
}

export const CONFIG_PG = {
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "admin",
    password: process.env.DB_PASSWORD || "pass",
    port: normalizePort(process.env.DB_PORT),
    database: "phoenix",
    ssl: false,
};
