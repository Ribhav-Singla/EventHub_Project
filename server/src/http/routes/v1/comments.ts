import express from "express";
import client from '../../../db/index';
import { userMiddleware } from "../../middleware/user";
import { restrictGuestActions } from "../../middleware/guest";
import { commentSchema } from "../../types";

export const commentRouter = express.Router();

commentRouter.post("/:eventId", userMiddleware, restrictGuestActions, async (req, res) => {
    const { eventId } = req.params;
    const { authorId, content } = req.body;

    const { success, error } = commentSchema.safeParse({ content, authorId })
    if (!success) {
        res.status(400).json({ error: 'Invlaid inputs' })
        return;
    }

    const comment = await client.comment.create({
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
});

commentRouter.post("/:eventId/:parentId", userMiddleware, restrictGuestActions, async (req, res) => {
    const { eventId, parentId } = req.params;
    const { authorId, content } = req.body;

    const { success, error } = commentSchema.safeParse({ content, authorId })
    if (!success) {
        res.status(400).json({ error: 'Invlaid inputs' })
        return;
    }

    const reply = await client.comment.create({
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
});

commentRouter.get("/:eventId", async (req, res) => {
    const { eventId } = req.params;
    const limit = parseInt(req.query.limit as string) || 5;
    const skip = parseInt(req.query.skip as string) || 0;

    const comments = await client.comment.findMany({
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
});

commentRouter.get("/:eventId/:commentId", async (req, res) => {
    const { eventId, commentId } = req.params;
    const limit = parseInt(req.query.limit as string) || 5;
    const skip = parseInt(req.query.skip as string) || 0;

    const replies = await client.comment.findMany({
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
});
