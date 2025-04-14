"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const globalErrorhandler_1 = __importDefault(require("./app/middlewares/globalErrorhandler"));
const notFound_1 = __importDefault(require("./app/middlewares/notFound"));
const routes_1 = __importDefault(require("./app/routes"));
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cors_1.default)({ origin: "*", credentials: true }));
app.use("/uploads", express_1.default.static("uploads"));
app.use("/api/v1", routes_1.default);
app.get("/", (req, res) => {
    res.send("Hello world!");
});
app.use(globalErrorhandler_1.default);
app.use(notFound_1.default);
exports.default = app;
