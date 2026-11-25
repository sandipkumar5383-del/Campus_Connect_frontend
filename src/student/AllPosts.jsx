
import React, { useEffect, useState } from "react";
import axios from "axios";

function AllPosts() {
    const [posts, setPosts] = useState([]);
    const [content, setContent] = useState("");
    const [file, setFile] = useState(null);
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    // EDIT STATES
    const [editingPost, setEditingPost] = useState(null);
    const [editContent, setEditContent] = useState("");
    const [editFile, setEditFile] = useState(null);
    const [updating, setUpdating] = useState(false);

    const user = JSON.parse(localStorage.getItem("user") || "null");

    const userId =
        user?._id || user?.id || localStorage.getItem("userid");

    const userName =
        user?.name || localStorage.getItem("name");

    const userRole = (
        user?.role || localStorage.getItem("role") || ""
    ).toLowerCase();

    const API = "http://localhost:8000/post";

    // GET ALL POSTS
    const getPosts = async () => {
        try {
            const res = await axios.get(`${API}/allPosts`);
            setPosts(res.data.posts || []);
        } catch (error) {
            console.log("Get Posts Error:", error);
        }
    };

    useEffect(() => {
        getPosts();
    }, []);

    // SHARED POST SCROLL
    useEffect(() => {
        if (posts.length === 0) return;

        const postId = window.location.hash.replace("#post-", "");
        if (!postId) return;

        const timer = setTimeout(() => {
            const element = document.getElementById(`post-${postId}`);

            if (element) {
                element.scrollIntoView({
                    behavior: "smooth",
                    block: "center"
                });
            }
        }, 300);

        return () => clearTimeout(timer);
    }, [posts]);

    // CHECK POST PERMISSION
    const canManagePost = (post) => {
        const ownerId = post.userId?._id || post.userId;

        return (
            userRole === "admin" ||
            String(ownerId) === String(userId)
        );
    };

    // CREATE POST
    const createPost = async (e) => {
        e.preventDefault();

        if (!content.trim() && !file) {
            setMessage("Please write something or select a photo.");
            return;
        }

        if (
            !userId ||
            !userName ||
            !["student", "admin"].includes(userRole)
        ) {
            setMessage("User details not found. Please login again.");
            return;
        }

        try {
            setLoading(true);
            setMessage("");

            const formData = new FormData();

            formData.append("userId", userId);
            formData.append("userName", userName);
            formData.append("userRole", userRole);
            formData.append("content", content.trim());

            if (file) {
                formData.append("file", file);
            }

            const res = await axios.post(
                `${API}/createPost`,
                formData
            );

            setMessage(res.data.message || "Post created successfully!");

            setContent("");
            setFile(null);
            e.target.reset();

            await getPosts();

        } catch (error) {
            setMessage(
                error.response?.data?.message || "Unable to create post"
            );
        } finally {
            setLoading(false);
        }
    };

    // LIKE / UNLIKE
    const handleLike = async (postId) => {
        if (!userId) {
            alert("Please login first");
            return;
        }

        try {
            await axios.put(
                `${API}/likePost/${postId}`,
                { userId }
            );

            await getPosts();

        } catch (error) {
            alert(error.response?.data?.message || "Unable to like post");
        }
    };

    // COMMENT
    const handleComment = async (postId) => {
        if (!userId || !userName) {
            alert("Please login first");
            return;
        }

        const text = prompt("Write your comment:");

        if (!text || !text.trim()) return;

        try {
            await axios.post(
                `${API}/commentPost/${postId}`,
                {
                    userId,
                    userName,
                    text: text.trim()
                }
            );

            await getPosts();

        } catch (error) {
            alert(error.response?.data?.message || "Unable to add comment");
        }
    };

    // SHARE
    const handleShare = async (postId) => {
        if (!userId) {
            alert("Please login first");
            return;
        }

        const postUrl =
            `${window.location.origin}/allPosts#post-${postId}`;

        try {
            await axios.post(
                `${API}/sharePost/${postId}`,
                { userId }
            );

            await getPosts();

            if (navigator.share) {
                try {
                    await navigator.share({
                        title: "Campus Connect",
                        text: "Check out this campus post!",
                        url: postUrl
                    });
                } catch (shareError) {
                    if (shareError.name !== "AbortError") {
                        console.log(shareError);
                    }
                }
            } else {
                await navigator.clipboard.writeText(postUrl);
                alert("Post link copied successfully!");
            }

        } catch (error) {
            alert(error.response?.data?.message || "Unable to share post");
        }
    };

    // DELETE POST
    const handleDelete = async (postId) => {
        if (!window.confirm("Are you sure you want to delete this post?")) {
            return;
        }

        try {
            await axios.delete(
                `${API}/deletePost/${postId}`,
                {
                    data: { userId, userRole }
                }
            );

            alert("Post deleted successfully!");

            if (editingPost === postId) {
                setEditingPost(null);
            }

            await getPosts();

        } catch (error) {
            alert(error.response?.data?.message || "Unable to delete post");
        }
    };

    // OPEN EDIT FORM
    const handleEditClick = (post) => {
        setEditingPost(post._id);
        setEditContent(post.content || "");
        setEditFile(null);

        // Scroll to the edit form
        setTimeout(() => {
            document.getElementById(`edit-${post._id}`)?.scrollIntoView({
                behavior: "smooth",
                block: "center"
            });
        }, 100);
    };

    // CANCEL EDIT
    const handleCancelEdit = () => {
        setEditingPost(null);
        setEditContent("");
        setEditFile(null);
    };

    // UPDATE POST
    const handleUpdatePost = async (postId) => {
        if (!editContent.trim() && !editFile &&
            !posts.find(p => p._id === postId)?.file) {
            alert("Please enter content or select a file.");
            return;
        }

        try {
            setUpdating(true);

            const formData = new FormData();

            formData.append("userId", userId);
            formData.append("userRole", userRole);
            formData.append("content", editContent);

            if (editFile) {
                formData.append("file", editFile);
            }

            await axios.put(
                `${API}/updatePost/${postId}`,
                formData
            );

            alert("Post updated successfully!");

            handleCancelEdit();
            await getPosts();

        } catch (error) {
            alert(
                error.response?.data?.message || "Unable to update post"
            );
        } finally {
            setUpdating(false);
        }
    };

    return (
        <div style={styles.page}>
            <div style={styles.container}>

                <h2 style={styles.heading}>
                    🌐 Campus Connect
                </h2>

                <p style={styles.subtitle}>
                    Share your campus moments
                </p>

                {/* CREATE POST */}
                <div style={styles.createCard}>
                    <h3 style={styles.createHeading}>
                        ✨ Create a Post
                    </h3>

                    <form onSubmit={createPost}>
                        <textarea
                            style={styles.textarea}
                            placeholder="What's happening on your campus?"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            rows="4"
                        />

                        <div style={styles.createBottom}>
                            <label style={styles.fileLabel}>
                                📷 Photo / PDF

                                <input
                                    type="file"
                                    accept="image/*,.pdf"
                                    onChange={(e) =>
                                        setFile(e.target.files[0] || null)
                                    }
                                    style={{ display: "none" }}
                                />
                            </label>

                            <button
                                type="submit"
                                disabled={loading}
                                style={styles.postButton}
                            >
                                {loading ? "Posting..." : "Post"}
                            </button>
                        </div>

                        {file && (
                            <p style={styles.selectedFile}>
                                📎 Selected: {file.name}
                            </p>
                        )}

                        {message && (
                            <p style={styles.message}>{message}</p>
                        )}
                    </form>
                </div>

                {/* ALL POSTS */}
                <h3 style={styles.feedHeading}>
                    Explore Posts
                </h3>

                {posts.length === 0 ? (
                    <p style={styles.emptyMessage}>
                        No posts available. Be the first to post!
                    </p>
                ) : (
                    posts.map((post) => {
                        const isLiked = post.likes?.some(
                            (id) =>
                                String(id?._id || id) === String(userId)
                        );

                        return (
                            <div
                                id={`post-${post._id}`}
                                style={styles.postCard}
                                key={post._id}
                            >

                                {/* USER DETAILS */}
                                <div style={styles.userInfo}>
                                    <div style={styles.avatar}>
                                        {post.userName?.charAt(0).toUpperCase()}
                                    </div>

                                    <div>
                                        <strong style={styles.userName}>
                                            {post.userName}
                                        </strong>

                                        <p style={styles.role}>
                                            {post.userRole}
                                        </p>
                                    </div>
                                </div>

                                {/* EDIT FORM */}
                                {editingPost === post._id && (
                                    <div
                                        id={`edit-${post._id}`}
                                        style={styles.editBox}
                                    >
                                        <h3 style={styles.editHeading}>
                                            ✏️ Edit Your Post
                                        </h3>

                                        <textarea
                                            value={editContent}
                                            onChange={(e) =>
                                                setEditContent(e.target.value)
                                            }
                                            placeholder="Edit your post..."
                                            rows="5"
                                            style={styles.textarea}
                                        />

                                        <div style={styles.editFile}>
                                            <label>
                                                📎 Change Photo / PDF
                                            </label>

                                            <input
                                                type="file"
                                                accept="image/*,.pdf"
                                                onChange={(e) =>
                                                    setEditFile(
                                                        e.target.files[0] || null
                                                    )
                                                }
                                            />
                                        </div>

                                        {editFile && (
                                            <p style={styles.selectedFile}>
                                                Selected: {editFile.name}
                                            </p>
                                        )}

                                        <div style={styles.editActions}>
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    handleUpdatePost(post._id)
                                                }
                                                disabled={updating}
                                                style={styles.saveButton}
                                            >
                                                {updating
                                                    ? "Saving..."
                                                    : "💾 Save Changes"}
                                            </button>

                                            <button
                                                type="button"
                                                onClick={handleCancelEdit}
                                                style={styles.cancelButton}
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {/* POST CONTENT */}
                                {post.content && (
                                    <p style={styles.postContent}>
                                        {post.content}
                                    </p>
                                )}

                                {/* POST IMAGE */}
                                {post.file && post.fileType === "image" && (
                                    <img
                                        src={`http://localhost:8000/posts/${post.file}`}
                                        alt="Post"
                                        style={styles.postImage}
                                    />
                                )}

                                {/* POST PDF */}
                                {post.file && post.fileType === "pdf" && (
                                    <a
                                        href={`http://localhost:8000/posts/${post.file}`}
                                        target="_blank"
                                        rel="noreferrer"
                                        style={styles.pdfLink}
                                    >
                                        📄 View PDF
                                    </a>
                                )}

                                {/* ACTIONS */}
                                <div style={styles.actions}>
                                    <button
                                        onClick={() => handleLike(post._id)}
                                        style={{
                                            ...styles.actionButton,
                                            color: isLiked ? "#e11d48" : "#344563"
                                        }}
                                    >
                                        {isLiked ? "❤️ Liked" : "🤍 Like"}
                                        {" "}({post.likes?.length || 0})
                                    </button>

                                    <button
                                        onClick={() => handleComment(post._id)}
                                        style={styles.actionButton}
                                    >
                                        💬 Comment
                                        {" "}({post.comments?.length || 0})
                                    </button>

                                    <button
                                        onClick={() => handleShare(post._id)}
                                        style={styles.actionButton}
                                    >
                                        🔗 Share
                                        {" "}({post.shares?.length || 0})
                                    </button>

                                    {canManagePost(post) && (
                                        <>
                                            <button
                                                onClick={() =>
                                                    handleEditClick(post)
                                                }
                                                style={{
                                                    ...styles.actionButton,
                                                    color: "#2563eb"
                                                }}
                                            >
                                                ✏️ Edit
                                            </button>

                                            <button
                                                onClick={() =>
                                                    handleDelete(post._id)
                                                }
                                                style={{
                                                    ...styles.actionButton,
                                                    color: "#dc2626"
                                                }}
                                            >
                                                🗑️ Delete
                                            </button>
                                        </>
                                    )}
                                </div>

                                {/* COMMENTS */}
                                {post.comments?.length > 0 && (
                                    <div style={styles.commentSection}>
                                        <strong>Comments</strong>

                                        {post.comments.map((comment, index) => (
                                            <div
                                                key={comment._id || index}
                                                style={styles.commentBox}
                                            >
                                                <strong>
                                                    {comment.userName}
                                                </strong>

                                                <p style={styles.commentText}>
                                                    {comment.text}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                <small style={styles.date}>
                                    {new Date(post.createdAt).toLocaleString()}
                                </small>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
}

// CSS STYLES
const styles = {
    page: {
        background: "#f0f2f5",
        minHeight: "100vh",
        padding: "25px 12px"
    },

    container: {
        maxWidth: "700px",
        margin: "auto"
    },

    heading: {
        textAlign: "center",
        color: "#243b67",
        fontSize: "28px"
    },

    subtitle: {
        textAlign: "center",
        color: "#777",
        marginBottom: "25px"
    },

    createCard: {
        background: "white",
        padding: "24px",
        borderRadius: "15px",
        margin: "25px 0",
        boxShadow: "0 3px 12px #00000012"
    },

    createHeading: {
        marginTop: "0",
        color: "#222"
    },

    textarea: {
        width: "100%",
        boxSizing: "border-box",
        padding: "14px",
        border: "1px solid #ddd",
        borderRadius: "10px",
        resize: "vertical",
        fontSize: "15px",
        outline: "none"
    },

    createBottom: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: "15px"
    },

    fileLabel: {
        cursor: "pointer",
        color: "#2563eb",
        fontWeight: "bold"
    },

    postButton: {
        background: "#2563eb",
        color: "white",
        border: "none",
        padding: "11px 30px",
        borderRadius: "25px",
        cursor: "pointer",
        fontWeight: "bold"
    },

    selectedFile: {
        color: "#555",
        fontSize: "13px",
        marginTop: "15px"
    },

    message: {
        color: "#2563eb",
        fontWeight: "bold"
    },

    feedHeading: {
        color: "#243b67",
        marginTop: "30px",
        fontSize: "22px"
    },

    emptyMessage: {
        textAlign: "center",
        color: "#777",
        padding: "30px"
    },

    postCard: {
        background: "white",
        padding: "20px",
        borderRadius: "15px",
        marginBottom: "22px",
        boxShadow: "0 3px 12px #00000012"
    },

    userInfo: {
        display: "flex",
        alignItems: "center",
        gap: "12px"
    },

    avatar: {
        width: "45px",
        height: "45px",
        borderRadius: "50%",
        background: "#243b67",
        color: "white",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontWeight: "bold",
        fontSize: "18px"
    },

    userName: {
        color: "#222",
        fontSize: "15px"
    },

    role: {
        margin: "3px 0",
        color: "#888",
        fontSize: "12px",
        textTransform: "capitalize"
    },

    editBox: {
        background: "#f5f3ff",
        padding: "20px",
        borderRadius: "12px",
        margin: "18px 0",
        border: "1px solid #ddd6fe"
    },

    editHeading: {
        marginTop: "0",
        color: "#4338ca"
    },

    editFile: {
        display: "flex",
        flexDirection: "column",
        gap: "10px",
        marginTop: "15px",
        color: "#444"
    },

    editActions: {
        display: "flex",
        gap: "10px",
        flexWrap: "wrap",
        marginTop: "18px"
    },

    saveButton: {
        background: "#2563eb",
        color: "white",
        border: "none",
        padding: "11px 20px",
        borderRadius: "8px",
        cursor: "pointer",
        fontWeight: "bold"
    },

    cancelButton: {
        background: "#e5e7eb",
        color: "#333",
        border: "none",
        padding: "11px 20px",
        borderRadius: "8px",
        cursor: "pointer"
    },

    postContent: {
        margin: "20px 0",
        whiteSpace: "pre-wrap",
        color: "#333",
        fontSize: "15px",
        lineHeight: "1.6"
    },

    postImage: {
        width: "100%",
        maxHeight: "500px",
        objectFit: "contain",
        borderRadius: "10px",
        marginTop: "12px",
        background: "#f5f5f5"
    },

    pdfLink: {
        display: "inline-block",
        marginTop: "15px",
        color: "#2563eb",
        fontWeight: "bold"
    },

    actions: {
        display: "flex",
        justifyContent: "space-around",
        flexWrap: "wrap",
        gap: "5px",
        borderTop: "1px solid #eee",
        paddingTop: "13px",
        marginTop: "15px"
    },

    actionButton: {
        border: "none",
        background: "transparent",
        cursor: "pointer",
        fontSize: "14px",
        fontWeight: "bold",
        color: "#344563",
        padding: "9px 5px"
    },

    commentSection: {
        marginTop: "15px",
        paddingTop: "12px",
        borderTop: "1px solid #eee"
    },

    commentBox: {
        background: "#f4f5f7",
        padding: "10px",
        borderRadius: "8px",
        marginTop: "8px"
    },

    commentText: {
        margin: "5px 0 0",
        color: "#444",
        fontSize: "14px"
    },

    date: {
        display: "block",
        color: "#999",
        marginTop: "15px",
        fontSize: "11px"
    }
};

export default AllPosts;
