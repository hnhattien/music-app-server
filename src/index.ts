import express from "express";
import http from "http";
import cors from "cors";
import { Server } from "socket.io";

import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import { ErrorBase, InternalServerError } from "./core/types/ErrorTypes";
import { get } from "lodash";
import routes from "./routes";
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "http://localhost:3000", credentials: true },
});
app.use(
  express.json({
    limit: "50mb",
  })
);
app.use(
  cors({
    origin: ["http://localhost:3000"],
    credentials: true,
  })
);
app.use(
  bodyParser.json({
    limit: "50mb",
  })
);
app.use(express.urlencoded({ extended: false, limit: "25mb" }));
app.use(bodyParser.urlencoded({ limit: "25mb", extended: true }));
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("hello world");
});
routes(app);

app.use(
  (
    error?: any,
    req?: any,
    res?: any,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    next?: any
  ) => {
    const { httpCode } = error;
    const responsecodeStatus =
      Number(httpCode) >= 100 && Number(httpCode) <= 599 ? httpCode : 500;

    if (error instanceof ErrorBase) {
      res.status(responsecodeStatus).json(error);
    } else {
      res
        .status(responsecodeStatus)
        .json(
          new InternalServerError(
            get(error, "message"),
            null,
            responsecodeStatus,
            get(error, "type"),
            get(error, "additionalProperties")
          )
        );
    }
  }
);

server.listen(3200, () => {
  console.log("listening on *:3200");
});
