import { useEffect, useState } from "react";
import { MessageSquare, ChevronDown, ChevronUp } from "lucide-react";
import { authState, type Comment } from "../../recoil/index";
import { useRecoilValue } from "recoil";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";

export function CommentSection({title,description}:{title: string,description:string}) {
  const auth = useRecoilValue(authState);
  const eventId = useParams().eventId;
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [postBtnLoader, setPostBtnLoader] = useState(false);
  const [replyBtnLoader, setReplyBtnLoader] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [pagination, setPagination] = useState({
    limit: 5,
    skip: 0,
  });

  // Track expanded comments and reply pagination
  const [expandedComments, setExpandedComments] = useState<
    Record<string, boolean>
  >({});
  const [loadingReplies, setLoadingReplies] = useState<Record<string, boolean>>(
    {}
  );
  const [repliesPagination, setRepliesPagination] = useState<
    Record<string, { limit: number; skip: number; hasMore: boolean }>
  >({});

  const fetchComments = async (
    limit = pagination.limit,
    skip = pagination.skip,
    append = false
  ) => {
    try {
      const isInitialLoad = !append;
      if (isInitialLoad) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }

      const response = await axios.get(
        `${
          import.meta.env.VITE_BACKEND_URL
        }/comments/${eventId}?limit=${limit}&skip=${skip}`
      );

      if (response.data.length < limit) {
        setHasMore(false);
      }

      if (append) {
        setComments((prevComments) => [...prevComments, ...response.data]);
      } else {
        setComments(response.data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, []);

  const loadMoreComments = () => {
    const newSkip = pagination.skip + pagination.limit;
    setPagination((prev) => ({
      ...prev,
      skip: newSkip,
    }));
    fetchComments(pagination.limit, newSkip, true);
  };

  const toggleReplies = async (commentId: string) => {
    // Toggle the expanded state
    setExpandedComments((prev) => ({
      ...prev,
      [commentId]: !prev[commentId],
    }));

    // Initialize pagination for this comment if not already done
    if (!repliesPagination[commentId]) {
      setRepliesPagination((prev) => ({
        ...prev,
        [commentId]: {
          limit: 5,
          skip: 0,
          hasMore: true,
        },
      }));
    }

    // If we're expanding and there are no replies loaded yet, fetch them
    const isExpanding = !expandedComments[commentId];
    if (isExpanding) {
      // Find the comment to check if it has replies
      const comment = comments.find((c) => c.id === commentId);
      if (comment && comment.replies.length === 0) {
        await fetchReplies(commentId);
      }
    }
  };

  const fetchReplies = async (commentId: string, append = false) => {
    const pagination = repliesPagination[commentId] || { limit: 5, skip: 0 };

    try {
      setLoadingReplies((prev) => ({ ...prev, [commentId]: true }));

      const response = await axios.get(
        `${
          import.meta.env.VITE_BACKEND_URL
        }/comments/${eventId}/${commentId}?limit=${pagination.limit}&skip=${
          pagination.skip
        }`
      );

      const newReplies = response.data;

      // Update hasMore flag
      const hasMoreReplies = newReplies.length === pagination.limit;
      setRepliesPagination((prev) => ({
        ...prev,
        [commentId]: {
          ...pagination,
          hasMore: hasMoreReplies,
        },
      }));

      // Update the comments with new replies
      setComments((prevComments) =>
        prevComments.map((comment) => {
          if (comment.id === commentId) {
            return {
              ...comment,
              replies: append
                ? [...comment.replies, ...newReplies]
                : newReplies,
            };
          }
          return comment;
        })
      );
    } catch (error) {
      console.error("Error fetching replies:", error);
    } finally {
      setLoadingReplies((prev) => ({ ...prev, [commentId]: false }));
    }
  };

  const loadMoreReplies = async (commentId: string) => {
    const currentPagination = repliesPagination[commentId];
    if (!currentPagination) return;

    const newSkip = currentPagination.skip + currentPagination.limit;

    // Update pagination first
    setRepliesPagination((prev) => ({
      ...prev,
      [commentId]: {
        ...prev[commentId],
        skip: newSkip,
      },
    }));

    // Then fetch with the new pagination
    const updatedPagination = {
      ...currentPagination,
      skip: newSkip,
    };

    try {
      setLoadingReplies((prev) => ({ ...prev, [commentId]: true }));

      const response = await axios.get(
        `${
          import.meta.env.VITE_BACKEND_URL
        }/comments/${eventId}/${commentId}?limit=${
          updatedPagination.limit
        }&skip=${updatedPagination.skip}`
      );

      const newReplies = response.data;

      // Update hasMore flag
      const hasMoreReplies = newReplies.length === updatedPagination.limit;
      setRepliesPagination((prev) => ({
        ...prev,
        [commentId]: {
          ...updatedPagination,
          hasMore: hasMoreReplies,
        },
      }));

      // Append the new replies
      setComments((prevComments) =>
        prevComments.map((comment) => {
          if (comment.id === commentId) {
            return {
              ...comment,
              replies: [...comment.replies, ...newReplies],
            };
          }
          return comment;
        })
      );
    } catch (error) {
      console.error("Error loading more replies:", error);
    } finally {
      setLoadingReplies((prev) => ({ ...prev, [commentId]: false }));
    }
  };

  const postComment = async () => {
    const authorId = auth.isAuthenticated ? auth.id : undefined;
    if (!authorId) {
      toast.error("You must login first to post a comment");
      return;
    }
    try {
      setPostBtnLoader(true);
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/comments/${eventId}`,
        { content: newComment, authorId },
        {
          headers: {
            Authorization: `${localStorage.getItem("token")}`,
          },
        }
      );
      const comment: Comment = {
        id: response.data.id,
        author: response.data.author.firstname,
        content: response.data.content,
        timestamp: response.data.timestamp,
        replies: response.data.replies,
      };
      setComments([comment, ...comments]);
      setNewComment("");
    } catch (error) {
      console.error(error);
    } finally {
      setPostBtnLoader(false);
    }
  };

  const handleAddReply = async (parentId: string) => {
    const authorId = auth.isAuthenticated ? auth.id : undefined;
    if (!authorId) {
      toast.error("You must login first to post a reply");
      return;
    }
    if (!replyContent.trim()) return;

    try {
      setReplyBtnLoader(true);
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/comments/${eventId}/${parentId}`,
        {
          content: replyContent,
          authorId,
          eventId,
          parentId,
        },
        {
          headers: {
            Authorization: `${localStorage.getItem("token")}`,
          },
        }
      );
      const reply: Comment = {
        id: response.data.id,
        author: response.data.author.firstname,
        content: response.data.content,
        timestamp: response.data.timestamp,
        replies: response.data.replies,
      };

      // Ensure the comment is expanded to show the new reply
      setExpandedComments((prev) => ({
        ...prev,
        [parentId]: true,
      }));

      setComments(
        comments.map((comment) => {
          if (comment.id === parentId) {
            return {
              ...comment,
              replies: [reply, ...comment.replies],
            };
          }
          return comment;
        })
      );
      setReplyContent("");
      setReplyingTo(null);
    } catch (error) {
      console.error(error);
    } finally {
      setReplyBtnLoader(false);
    }
  };

  const generateComment = async () => {
    setIsGenerating(true);

    try {
      const response = await fetch(
        "https://api.groq.com/openai/v1/chat/completions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_GROQ_API_KEY}`,
          },
          body: JSON.stringify({
            model: "llama3-70b-8192",
            messages: [
              {
                role: "system",
                content:
                  "You are a helpful assistant that writes thoughtful, conversational, and engaging comments. Always keep it under 200 characters and never use placeholder text.",
              },
              {
                role: "user",
                content: `Here's an event post:\nTitle: "${title}"\nDescription: "${description}"\n\nWrite a brief, natural-sounding comment (under 200 characters) that shows excitement and invites discussion.`,
              },
            ],
            max_tokens: 200,
          }),
        }
      );

      const data = await response.json();
      const generatedComment = data.choices[0].message.content
        .trim()
        .replace(/"/g, "");

      setNewComment(generatedComment);
    } catch (error) {
      console.error("Error generating comment:", error);
      toast.error("Failed to generate comment. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="max-w-full mx-auto p-6 bg-white rounded-xl shadow-lg">
      <div className="flex items-center gap-2 mb-6">
        <MessageSquare className="w-6 h-6 text-blue-500" />
        <h2 className="text-2xl font-bold text-gray-800">Comments</h2>
      </div>
      {loading ? (
        <div className="flex justify-center items-center py-10">
          <span className="loader"></span>
        </div>
      ) : (
        <div>
          <form className="mb-8">
            <div className="relative">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Add a comment..."
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                maxLength={200}
                rows={3}
              />
              <button
                type="button"
                onClick={generateComment}
                disabled={isGenerating}
                className="absolute bottom-2 right-2 bg-purple-500 text-white px-3 py-1 text-sm rounded-md hover:bg-purple-600 transition-colors flex items-center gap-1"
              >
                {isGenerating ? (
                  <>
                    <span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin mr-1"></span>
                    Generating...
                  </>
                ) : (
                  <>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="lucide lucide-sparkles"
                    >
                      <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
                      <path d="M5 3v4" />
                      <path d="M19 17v4" />
                      <path d="M3 5h4" />
                      <path d="M17 19h4" />
                    </svg>
                    Generate with AI
                  </>
                )}
              </button>
            </div>
            <div className="flex justify-between">
              <button
                type="button"
                className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                onClick={postComment}
                disabled={postBtnLoader || isGenerating}
              >
                {postBtnLoader ? "Commenting..." : "Post Comment"}
              </button>
              <p>{newComment.length}/200 characters</p>
            </div>
          </form>

          <div className="space-y-6">
            {comments.map((comment) => (
              <div key={comment.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-semibold text-gray-800">
                      {comment.author}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {new Date(comment.timestamp).toLocaleDateString()}
                    </p>
                  </div>
                  <button
                    onClick={() => setReplyingTo(comment.id)}
                    className="text-blue-500 text-sm hover:text-blue-600"
                  >
                    Reply
                  </button>
                </div>
                <p className="text-gray-700 mb-4">{comment.content}</p>

                {replyingTo === comment.id && (
                  <div className="ml-8 mb-4">
                    <textarea
                      value={replyContent}
                      onChange={(e) => setReplyContent(e.target.value)}
                      placeholder="Write a reply..."
                      className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      rows={2}
                    />
                    <div className="mt-2 space-x-2">
                      <button
                        onClick={() => handleAddReply(comment.id)}
                        className="px-3 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                        disabled={replyBtnLoader}
                      >
                        {replyBtnLoader ? "Replying..." : "Post Reply"}
                      </button>
                      <button
                        onClick={() => {
                          setReplyingTo(null);
                          setReplyContent("");
                        }}
                        className="px-3 py-1 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}

                {/* Display number of replies and toggle button */}
                {comment.replies && comment.replies.length > 0 && (
                  <div className="mt-2 mb-2">
                    <button
                      onClick={() => toggleReplies(comment.id)}
                      className="flex items-center text-blue-500 text-sm font-medium hover:text-blue-600"
                    >
                      {expandedComments[comment.id] ? (
                        <>
                          <ChevronUp size={16} className="mr-1" />
                          Hide Replies ({comment.replies.length})
                        </>
                      ) : (
                        <>
                          <ChevronDown size={16} className="mr-1" />
                          View Replies ({comment.replies.length})
                        </>
                      )}
                    </button>
                  </div>
                )}

                {/* Display replies when expanded */}
                {expandedComments[comment.id] && (
                  <div className="ml-8 mt-4 space-y-4">
                    {comment.replies.length > 0 ? (
                      <>
                        {comment.replies.map((reply) => (
                          <div
                            key={reply.id}
                            className="border-l-2 border-gray-200 pl-4"
                          >
                            <div className="flex justify-between items-start mb-2">
                              <div>
                                <h4 className="font-semibold text-gray-800">
                                  {reply.author}
                                </h4>
                                <p className="text-sm text-gray-500">
                                  {new Date(
                                    reply.timestamp
                                  ).toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                            <p className="text-gray-700">{reply.content}</p>
                          </div>
                        ))}

                        {/* Load more replies button */}
                        {repliesPagination[comment.id]?.hasMore && (
                          <div className="pt-2">
                            <button
                              onClick={() => loadMoreReplies(comment.id)}
                              disabled={loadingReplies[comment.id]}
                              className="text-blue-500 text-sm font-medium hover:text-blue-600 flex items-center"
                            >
                              {loadingReplies[comment.id] ? (
                                <>
                                  <span className="w-3 h-3 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mr-2"></span>
                                  Loading more replies...
                                </>
                              ) : (
                                "View more replies"
                              )}
                            </button>
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="text-gray-500 text-sm">
                        {loadingReplies[comment.id] ? (
                          <div className="flex items-center">
                            <span className="w-3 h-3 border-2 border-gray-500 border-t-transparent rounded-full animate-spin mr-2"></span>
                            Loading replies...
                          </div>
                        ) : (
                          "No replies yet"
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}

            {hasMore && (
              <div className="flex justify-center pt-4 pb-2">
                <button
                  onClick={loadMoreComments}
                  disabled={loadingMore}
                  className="px-5 py-2 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2"
                >
                  {loadingMore ? (
                    <>
                      <span className="w-4 h-4 border-2 border-gray-600 border-t-transparent rounded-full animate-spin"></span>
                      Loading more...
                    </>
                  ) : (
                    "View More Comments"
                  )}
                </button>
              </div>
            )}

            {!hasMore && comments.length > 0 && (
              <p className="text-center text-gray-500 py-2">
                No more comments to load
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
