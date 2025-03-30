import jwt from 'jsonwebtoken';
import { JWT_PASSWORD } from '../config';
import { NextFunction, Request, Response } from "express";

export const userMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const header = req.headers["authorization"];
    const token = header?.split(" ")[1];
    if (!token) {
        res.status(401).json({message: "Unauthorized"})
        return
    }
    try {
        const decoded = jwt.verify(token, JWT_PASSWORD) as { userId: string }
        req.userId = decoded.userId
        console.log('token verified');
        next()
    } catch(e) {
        res.status(401).json({message: "Unauthorized"})
        return
    }
}

export const optionalUserMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const header = req.headers["authorization"];
    const token = header?.split(" ")[1];
    if (token) {
        try {
            const decoded = jwt.verify(token, JWT_PASSWORD) as { userId: string }
            req.userId = decoded.userId
            console.log('Inside optionUserMiddleware, token verified');
        } catch(e) {
            console.log('optional user middleware error', e);
        }
    }
    next()
}