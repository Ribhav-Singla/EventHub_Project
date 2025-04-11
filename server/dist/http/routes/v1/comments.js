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
exports.commentRouter = void 0;
const express_1 = __importDefault(require("express"));
const index_1 = __importDefault(require("../../../db/index"));
const user_1 = require("../../middleware/user");
const guest_1 = require("../../middleware/guest");
const types_1 = require("../../types");
exports.commentRouter = express_1.default.Router();
exports.commentRouter.post("/:eventId", user_1.userMiddleware, guest_1.restrictGuestActions, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { eventId } = req.params;
    const { authorId, content } = req.body;
    const { success, error } = types_1.commentSchema.safeParse({ content, authorId });
    if (!success) {
        res.status(400).json({ error: 'Invlaid inputs' });
        return;
    }
    const comment = yield index_1.default.comment.create({
        data: {
            content,
            authorId,
            eventId,
        },
        select: {
            id: true,
            content: true,
            replies: true,
            timestamp: true,
            author: {
                select: {
                    id: true,
                    firstname: true,
                    lastname: true,
                }
            }
        }
    });
    res.json(comment);
}));
exports.commentRouter.post("/:eventId/:parentId", user_1.userMiddleware, guest_1.restrictGuestActions, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { eventId, parentId } = req.params;
    const { authorId, content } = req.body;
    const { success, error } = types_1.commentSchema.safeParse({ content, authorId });
    if (!success) {
        res.status(400).json({ error: 'Invlaid inputs' });
        return;
    }
    const reply = yield index_1.default.comment.create({
        data: {
            content,
            authorId,
            eventId,
            parentId,
        },
        select: {
            id: true,
            content: true,
            replies: true,
            timestamp: true,
            author: {
                select: {
                    id: true,
                    firstname: true,
                    lastname: true,
                }
            }
        }
    });
    res.json(reply);
}));
exports.commentRouter.get("/:eventId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { eventId } = req.params;
    const limit = parseInt(req.query.limit) || 5;
    const skip = parseInt(req.query.skip) || 0;
    const comments = yield index_1.default.comment.findMany({
        where: {
            eventId,
            parentId: null,
        },
        orderBy: {
            timestamp: "desc",
        },
        skip,
        take: limit,
        select: {
            id: true,
            timestamp: true,
            content: true,
            replies: {
                select: {
                    id: true,
                    timestamp: true,
                    content: true,
                    author: {
                        select: {
                            firstname: true,
                            lastname: true,
                        },
                    },
                },
                orderBy: {
                    timestamp: "asc",
                },
                take: 5,
            },
            author: {
                select: {
                    id: true,
                    firstname: true,
                    lastname: true,
                }
            },
        },
    });
    const formattedComments = comments.map(comment => ({
        id: comment.id,
        author: `${comment.author.firstname} ${comment.author.lastname}`,
        content: comment.content,
        timestamp: comment.timestamp,
        replies: comment.replies.map(reply => ({
            id: reply.id,
            author: `${reply.author.firstname} ${reply.author.lastname}`,
            content: reply.content,
            timestamp: reply.timestamp,
            replies: [],
        })),
    }));
    res.json(formattedComments);
}));
exports.commentRouter.get("/:eventId/:commentId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { eventId, commentId } = req.params;
    const limit = parseInt(req.query.limit) || 5;
    const skip = parseInt(req.query.skip) || 0;
    const replies = yield index_1.default.comment.findMany({
        where: {
            parentId: commentId,
        },
        orderBy: {
            timestamp: "asc",
        },
        skip,
        take: limit,
        select: {
            id: true,
            timestamp: true,
            content: true,
            author: {
                select: {
                    id: true,
                    firstname: true,
                    lastname: true,
                }
            },
            replies: {
                select: {
                    id: true,
                    timestamp: true,
                    content: true,
                    author: {
                        select: {
                            firstname: true,
                            lastname: true,
                        },
                    },
                },
                take: 0,
            },
        },
    });
    const formattedReplies = replies.map(reply => ({
        id: reply.id,
        author: `${reply.author.firstname} ${reply.author.lastname}`,
        content: reply.content,
        timestamp: reply.timestamp,
        replies: [],
    }));
    res.json(formattedReplies);
}));
