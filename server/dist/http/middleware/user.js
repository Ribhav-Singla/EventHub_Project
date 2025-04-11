"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.optionalUserMiddleware = exports.userMiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("../config");
const userMiddleware = (req, res, next) => {
    const header = req.headers["authorization"];
    const token = header === null || header === void 0 ? void 0 : header.split(" ")[1];
    if (!token) {
        res.status(401).json({ message: "Unauthorized" });
        return;
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, config_1.JWT_PASSWORD);
        req.userId = decoded.userId;
        console.log('token verified');
        next();
    }
    catch (e) {
        res.status(401).json({ message: "Unauthorized" });
        return;
    }
};
exports.userMiddleware = userMiddleware;
const optionalUserMiddleware = (req, res, next) => {
    const header = req.headers["authorization"];
    const token = header === null || header === void 0 ? void 0 : header.split(" ")[1];
    if (token) {
        try {
            const decoded = jsonwebtoken_1.default.verify(token, config_1.JWT_PASSWORD);
            req.userId = decoded.userId;
            console.log('Inside optionUserMiddleware, token verified');
        }
        catch (e) {
            console.log('optional user middleware error', e);
        }
    }
    next();
};
exports.optionalUserMiddleware = optionalUserMiddleware;
