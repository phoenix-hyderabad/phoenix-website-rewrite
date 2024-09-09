#!/usr/bin/env node

import app from "../app";
import http from "http";
import { PORT } from "../config/environment";
import logger from "../lib/logger";

function normalizePort(val: string) {
    let port = parseInt(val, 10);
    if (isNaN(port)) return val;
    if (port >= 0) return port;
    return false;
}

const port = normalizePort(PORT || "9000");
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
server.on("error", onError);
server.on("listening", onListening);

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error: any) {
    if (error.syscall !== "listen") throw error;
    let bind = typeof port === "string" ? "Pipe " + port : "Port " + port;
    // handle specific listen errors with friendly messages
    switch (error.code) {
        case "EACCES":
            logger.error(bind + " requires elevated privileges");
            process.exit(1);
        case "EADDRINUSE":
            logger.error(bind + " is already in use");
            process.exit(1);
        default:
            throw error;
    }
}

function onListening() {
    let addr = server.address();
    let bind = typeof addr === "string" ? "pipe " + addr : "port " + addr?.port;
    logger.debug("Listening on " + bind);
}
