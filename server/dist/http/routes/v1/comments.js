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
                            id: true,
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
        authorId: comment.author.id,
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
                            id: true,
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
        authorId: reply.author.id,
        content: reply.content,
        timestamp: reply.timestamp,
        replies: [],
    }));
    res.json(formattedReplies);
}));
exports.commentRouter.put("/:commentId", user_1.userMiddleware, guest_1.restrictGuestActions, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { commentId } = req.params;
    const { content, authorId } = req.body;
    const { success } = types_1.commentSchema.safeParse({ content, authorId });
    if (!success) {
        res.status(400).json({ error: "Invalid inputs" });
        return;
    }
    const existingComment = yield index_1.default.comment.findUnique({ where: { id: commentId } });
    if (!existingComment) {
        res.status(404).json({ error: "Comment not found" });
        return;
    }
    if (existingComment.authorId !== authorId) {
        res.status(403).json({ error: "Not authorized to update this comment" });
        return;
    }
    const updatedComment = yield index_1.default.comment.update({
        where: { id: commentId },
        data: { content },
        select: {
            id: true,
            content: true,
            timestamp: true,
        },
    });
    res.json(updatedComment);
}));
exports.commentRouter.delete("/top/:commentId", user_1.userMiddleware, guest_1.restrictGuestActions, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { commentId } = req.params;
    try {
        const comment = yield index_1.default.comment.findUnique({
            where: { id: commentId },
            select: { parentId: true },
        });
        if (!comment || comment.parentId !== null) {
            res.status(400).json({ error: "Comment is not a top-level comment" });
            return;
        }
        const deleteCommentWithReplies = (id) => __awaiter(void 0, void 0, void 0, function* () {
            const replies = yield index_1.default.comment.findMany({
                where: { parentId: id },
                select: { id: true },
            });
            for (const reply of replies) {
                yield deleteCommentWithReplies(reply.id);
            }
            yield index_1.default.comment.delete({ where: { id } });
        });
        yield deleteCommentWithReplies(commentId);
        res.status(200).json({ message: "Top-level comment and its replies deleted" });
    }
    catch (error) {
        console.error("Error deleting top-level comment:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}));
exports.commentRouter.delete("/reply/:replyId", user_1.userMiddleware, guest_1.restrictGuestActions, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { replyId } = req.params;
    try {
        const reply = yield index_1.default.comment.findUnique({
            where: { id: replyId },
            select: { parentId: true },
        });
        if (!reply || reply.parentId === null) {
            res.status(400).json({ error: "Comment is not a reply" });
            return;
        }
        yield index_1.default.comment.delete({
            where: { id: replyId },
        });
        res.status(200).json({ message: "Reply deleted" });
    }
    catch (error) {
        console.error("Error deleting reply:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}));
