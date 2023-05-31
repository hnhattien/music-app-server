"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const cors_1 = __importDefault(require("cors"));
const body_parser_1 = __importDefault(require("body-parser"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const ErrorTypes_1 = require("./core/types/ErrorTypes");
const lodash_1 = require("lodash");
const routes_1 = __importDefault(require("./routes"));
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
app.use(express_1.default.json({
    limit: "50mb",
}));
app.use((0, cors_1.default)({
    origin: ["http://localhost:3000"],
    credentials: true,
}));
app.use(body_parser_1.default.json({
    limit: "50mb",
}));
app.use(express_1.default.urlencoded({ extended: false, limit: "25mb" }));
app.use(body_parser_1.default.urlencoded({ limit: "25mb", extended: true }));
app.use((0, cookie_parser_1.default)());
app.get("/", (req, res) => {
    res.send("hello world");
});
(0, routes_1.default)(app);
app.use((error, req, res, 
// eslint-disable-next-line @typescript-eslint/no-unused-vars
next) => {
    const { httpCode } = error;
    const responsecodeStatus = Number(httpCode) >= 100 && Number(httpCode) <= 599 ? httpCode : 500;
    if (error instanceof ErrorTypes_1.ErrorBase) {
        res.status(responsecodeStatus).json(error);
    }
    else {
        res
            .status(responsecodeStatus)
            .json(new ErrorTypes_1.InternalServerError((0, lodash_1.get)(error, "message"), null, responsecodeStatus, (0, lodash_1.get)(error, "type"), (0, lodash_1.get)(error, "additionalProperties")));
    }
});
server.listen(3500, () => {
    console.log("listening on *:3500");
});
