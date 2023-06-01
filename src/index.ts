import express from "express";
import http from "http";
import cors from "cors";
import { Server } from "socket.io";

import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import { ErrorBase, InternalServerError } from "./core/types/ErrorTypes";
import { get } from "lodash";
import routes from "./routes";
import passport from "passport";
import flash from "express-flash";
import initPassport from "@core/authenticate/PassportInit";
import expressSession from "express-session";
import config from "@core/config";
const app = express();

const server = http.createServer(app);

const session = {
  secret: `secretcode`,
  cookie: { path: "/", originalMaxAge: 50000000 },
  resave: false,
  saveUninitialized: false,
};

app.use(
  express.json({
    limit: "50mb",
  })
);
console.log(config.CROSS_ORIGIN);
app.use(
  cors({
    origin: config.CROSS_ORIGIN,
    credentials: true,
  })
);
app.use(
  bodyParser.json({
    limit: "50mb",
  })
);
app.use(flash());
app.use(express.urlencoded({ extended: false, limit: "25mb" }));
app.use(bodyParser.urlencoded({ limit: "25mb", extended: true }));
app.use(cookieParser());

app.use(expressSession(session));
app.use(passport.initialize());
app.use(passport.session());
initPassport(passport);

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

server.listen(3500, () => {
  console.log("listening on *:3500");
});
