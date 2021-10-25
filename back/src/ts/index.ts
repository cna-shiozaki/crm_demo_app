import * as express from "express";
import { defiServer } from "./server";

const morgan = require("morgan");

// Create Express Server
const app = express();

// Configuration
const PORT = 5000;
const HOST = "localhost";

// Logging
app.use(morgan('dev'));

// Serve the backend
app.use("/ActivityService", defiServer.create());

app.listen(PORT);
console.log("Listening on port "+ PORT);