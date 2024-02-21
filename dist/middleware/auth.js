"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateJwt = exports.userAuthentication = exports.generateJwt = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const db_1 = require("../db");
require("dotenv").config();
const generateJwt = (user) => {
    const payload = { username: user.username };
    return jsonwebtoken_1.default.sign(payload, process.env.SECRET, { expiresIn: "1h" });
};
exports.generateJwt = generateJwt;
const userAuthentication = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password } = req.body;
    const user = yield db_1.Users.findOne({ username, password });
    if (user) {
        next();
    }
    else {
        res.status(403).json({ message: "User authentication failed" });
    }
});
exports.userAuthentication = userAuthentication;
const authenticateJwt = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (authHeader) {
        const token = authHeader.split(" ")[1];
        jsonwebtoken_1.default.verify(token, process.env.SECRET, (err, user) => {
            console.log(user);
            if (err) {
                return res.sendStatus(403);
            }
            if (!user) {
                return res.sendStatus(403);
            }
            req.headers["user"] = JSON.stringify(user);
            next();
        });
    }
    else {
        res.sendStatus(401);
    }
};
exports.authenticateJwt = authenticateJwt;
