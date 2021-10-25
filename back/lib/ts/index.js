"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const server_1 = require("./server");
const morgan = require("morgan");
// Create Express Server
const app = express();
// Configuration
const PORT = 5000;
const HOST = "localhost";
// Logging
app.use(morgan('dev'));
// Serve the backend
app.use("/ActivityService", server_1.defiServer.create());
app.listen(PORT);
console.log("Listening on port " + PORT);
//# sourceMappingURL=index.js.map