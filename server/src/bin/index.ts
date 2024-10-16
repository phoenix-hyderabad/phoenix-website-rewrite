#!/usr/bin/env node

import app from "../app";
import http from "http";
import { PORT } from "../config/environment";
import logger from "../lib/logger";
import { type Duplex } from "stream";

function normalizePort(val: string) {
    const port = parseInt(val, 10);
    if (isNaN(port)) return val;
    if (port >= 0) return port;
    return false;
}

const port = normalizePort(PORT ?? "9000");
app.set("port", port);

const server = http.createServer(app);

/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port, () => {
    if (process.env.name === "master") {
        // cronJobs();
        logger.info("Server started on port " + port + " as master");
    }
    logger.info("Server started on port " + port + " as slave");
});
server.on("clientError", onClientError);
server.on("listening", onListening);

if (import.meta.hot) {
    /* eslint-disable @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call */
    import.meta.hot.on("vite:beforeFullReload", () => {
        server.close();
    });
    import.meta.hot.dispose(() => {
        server.close();
    });
    /* eslint-enable @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call */
}

/**
 * Event listener for HTTP server "error" event.
 */

function onClientError(err: Error, socket: Duplex) {
    logger.error("HTTP Error: " + err.message);
    socket.end("HTTP/1.1 400 Bad Request\r\n\r\n");
}

function onListening() {
    const addr = server.address();
    const bind =
        typeof addr === "string" ? "pipe " + addr : "port " + addr?.port;
    logger.debug("Listening on " + bind);
}
