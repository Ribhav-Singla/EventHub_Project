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
            authorId: reply.author.id,
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
});

commentRouter.put("/:commentId", userMiddleware, restrictGuestActions, async (req, res) => {
    const { commentId } = req.params;
    const { content, authorId } = req.body;

    const { success } = commentSchema.safeParse({ content, authorId });
    if (!success) {
        res.status(400).json({ error: "Invalid inputs" });
        return;
    }

    const existingComment = await client.comment.findUnique({ where: { id: commentId } });
    if (!existingComment) {
        res.status(404).json({ error: "Comment not found" });
        return;
    }

    if (existingComment.authorId !== authorId) {
        res.status(403).json({ error: "Not authorized to update this comment" });
        return;
    }

    const updatedComment = await client.comment.update({
        where: { id: commentId },
        data: { content },
        select: {
            id: true,
            content: true,
            timestamp: true,
        },
    });

    res.json(updatedComment);
});

commentRouter.delete("/top/:commentId", userMiddleware, restrictGuestActions, async (req, res) => {
    const { commentId } = req.params;

    try {
        const comment = await client.comment.findUnique({
            where: { id: commentId },
            select: { parentId: true },
        });

        if (!comment || comment.parentId !== null) {
            res.status(400).json({ error: "Comment is not a top-level comment" });
            return ;
        }

        const deleteCommentWithReplies = async (id: string) => {
            const replies = await client.comment.findMany({
                where: { parentId: id },
                select: { id: true },
            });

            for (const reply of replies) {
                await deleteCommentWithReplies(reply.id);
            }

            await client.comment.delete({ where: { id } });
        };

        await deleteCommentWithReplies(commentId);

        res.status(200).json({ message: "Top-level comment and its replies deleted" });
    } catch (error) {
        console.error("Error deleting top-level comment:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

commentRouter.delete("/reply/:replyId", userMiddleware, restrictGuestActions, async (req, res) => {
    const { replyId } = req.params;

    try {
        const reply = await client.comment.findUnique({
            where: { id: replyId },
            select: { parentId: true },
        });

        if (!reply || reply.parentId === null) {
            res.status(400).json({ error: "Comment is not a reply" });
            return ;
        }

        await client.comment.delete({
            where: { id: replyId },
        });

        res.status(200).json({ message: "Reply deleted" });
    } catch (error) {
        console.error("Error deleting reply:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});
