
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import socket from "../socket/socket.js";

const API = "http://localhost:8000";

function StudentClubChat() {
    const userId = localStorage.getItem("userid");
    const username = localStorage.getItem("name") || "Student";
    const [clubs, setClubs] = useState([]);
    const [selectedClub, setSelectedClub] = useState(null);
    const [showClubDP, setShowClubDP] = useState(false);
    const [messages, setMessages] = useState([]);
    const [messageText, setMessageText] = useState("");
    const [selectedFile, setSelectedFile] = useState(null);
    const [search, setSearch] = useState("");
    const [loadingClubs, setLoadingClubs] = useState(true);
    const [loadingMessages, setLoadingMessages] = useState(false);
    const [sending, setSending] = useState(false);
    const [error, setError] = useState("");

    const messagesEndRef = useRef(null);
    const fileInputRef = useRef(null);

    // LOAD JOINED CLUBS
    useEffect(() => {
        const fetchClubs = async () => {
            try {
                setLoadingClubs(true);

                if (!userId) {
                    setError("Please login first.");
                    return;
                }

                const response = await axios.get(
                    `${API}/club/allClub`
                );

                const allClubs = Array.isArray(response.data)
                    ? response.data
                    : response.data.clubs || [];

                const joinedClubs = allClubs.filter(club =>
                    (club.members || []).some(member => {
                        const memberId =
                            typeof member === "object"
                                ? member._id
                                : member;

                        return String(memberId) === String(userId);
                    })
                );

                setClubs(joinedClubs);

                if (joinedClubs.length > 0) {
                    setSelectedClub(joinedClubs[0]);
                }

            } catch (err) {
                console.error("Club loading error:", err);
                setError(
                    err.response?.data?.message ||
                    "Unable to load clubs."
                );
            } finally {
                setLoadingClubs(false);
            }
        };

        fetchClubs();
    }, [userId]);

    // LOAD MESSAGES AND SOCKET.IO
    useEffect(() => {
        if (!selectedClub || !userId) return;

        let isActive = true;
        const clubId = selectedClub._id;

        const handleNewMessage = (newMessage) => {
            const receivedClubId =
                newMessage.clubId?._id || newMessage.clubId;

            if (String(receivedClubId) !== String(clubId)) {
                return;
            }

            setMessages(previous => {
                const exists = previous.some(
                    msg => String(msg._id) === String(newMessage._id)
                );

                if (exists) return previous;

                return [...previous, newMessage];
            });
        };

        const joinRoom = () => {
            socket.emit("joinClub", {
                clubId: clubId,
                userId: userId
            });
        };

        socket.on("newClubMessage", handleNewMessage);
        socket.on("connect", joinRoom);

        if (socket.connected) {
            joinRoom();
        }

        const fetchMessages = async () => {
            try {
                setLoadingMessages(true);
                setMessages([]);

                const response = await axios.get(
                    `${API}/message/clubs/${clubId}/users/${userId}/messages`
                );

                if (isActive) {
                    const oldMessages = Array.isArray(response.data)
                        ? response.data
                        : [];

                    setMessages(previous => {
                        const combined = [...oldMessages, ...previous];

                        const uniqueMessages = Array.from(
                            new Map(
                                combined.map(msg => [
                                    String(msg._id),
                                    msg
                                ])
                            ).values()
                        );

                        return uniqueMessages.sort(
                            (a, b) =>
                                new Date(a.timestamp || a.createdAt) -
                                new Date(b.timestamp || b.createdAt)
                        );
                    });
                }

            } catch (err) {
                console.error("Message loading error:", err);

                if (isActive) {
                    setError(
                        err.response?.data?.message ||
                        "Unable to load messages."
                    );
                }
            } finally {
                if (isActive) {
                    setLoadingMessages(false);
                }
            }
        };

        fetchMessages();

        return () => {
            isActive = false;

            socket.off("newClubMessage", handleNewMessage);
            socket.off("connect", joinRoom);

            if (socket.connected) {
                socket.emit("leaveClub", clubId);
            }
        };
    }, [selectedClub?._id, userId]);

    // AUTO SCROLL
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({
            behavior: "smooth"
        });
    }, [messages]);

    // SEND MESSAGE OR FILE
    const sendMessage = async (e) => {
        e.preventDefault();

        if (
            (!messageText.trim() && !selectedFile) ||
            !selectedClub ||
            sending ||
            !userId
        ) {
            return;
        }

        const formData = new FormData();

        formData.append("message", messageText.trim());

        if (selectedFile) {
            formData.append("file", selectedFile);
        }

        try {
            setSending(true);

            const response = await axios.post(
                `${API}/message/clubs/${selectedClub._id}/users/${userId}/messages`,
                formData
            );

            setMessages(previous => {
                const exists = previous.some(
                    msg => String(msg._id) === String(response.data._id)
                );

                return exists
                    ? previous
                    : [...previous, response.data];
            });

            setMessageText("");
            setSelectedFile(null);

            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }

        } catch (err) {
            console.error("Send message error:", err);

            alert(
                err.response?.data?.message ||
                "Unable to send message."
            );
        } finally {
            setSending(false);
        }
    };

    // SEARCH CLUBS
    const filteredClubs = clubs.filter(club =>
        (club.clubName || "")
            .toLowerCase()
            .includes(search.toLowerCase())
    );

    // SENDER NAME
    const getSenderName = (msg) => {
        if (
            typeof msg.senderId === "object" &&
            msg.senderId !== null
        ) {
            return msg.senderId.name || "Student";
        }

        return "Student";
    };

    // CHECK OWN MESSAGE
    const isMyMessage = (msg) => {
        const senderId =
            typeof msg.senderId === "object"
                ? msg.senderId?._id
                : msg.senderId;

        return String(senderId) === String(userId);
    };

    // FORMAT TIME
    const getTime = (date) => {
        if (!date) return "";

        return new Date(date).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit"
        });
    };

    // CLUB IMAGE
    const getClubImage = (club) => {
        return club?.image
            ? `${API}${club.image}`
            : null;
    };

    // FILE DISPLAY
    const renderFile = (msg) => {
        if (!msg.fileUrl) return null;

        const fileUrl = `${API}${msg.fileUrl}`;

        const isImage = msg.fileType?.startsWith("image/");
        const isVideo = msg.fileType?.startsWith("video/");
        const isAudio = msg.fileType?.startsWith("audio/");
        const isPdf = msg.fileType === "application/pdf";

        if (isImage) {
            return (
                <a
                    href={fileUrl}
                    target="_blank"
                    rel="noreferrer"
                >
                    <img
                        className="chat-shared-image"
                        src={fileUrl}
                        alt={msg.fileName || "Shared image"}
                    />
                </a>
            );
        }

        if (isVideo) {
            return (
                <video
                    className="chat-shared-video"
                    controls
                    src={fileUrl}
                />
            );
        }

        if (isAudio) {
            return (
                <audio
                    className="chat-shared-audio"
                    controls
                    src={fileUrl}
                />
            );
        }

        return (
            <a
                className="chat-file-link"
                href={fileUrl}
                target="_blank"
                rel="noreferrer"
                download={!isPdf}
            >
                <span>{isPdf ? "📕" : "📎"}</span>

                <span>
                    <strong>
                        {msg.fileName || "Shared file"}
                    </strong>

                    <small>
                        {isPdf
                            ? "PDF document · Open"
                            : "Open or download file"}
                    </small>
                </span>

                <span>⬇</span>
            </a>
        );
    };

    return (
        <div className="club-chat-page">
            <div className="chat-container">

                {/* LEFT SIDEBAR */}
                <aside className="chat-sidebar">

                    <div className="sidebar-header">
                        <div>
                            <h2>💬 Club Chat</h2>
                            <p>Campus Connect Community</p>
                        </div>

                        <span className="online-dot"></span>
                    </div>

                    {/* STUDENT PROFILE */}
                    <div className="student-profile">
                        <div className="profile-avatar">
                            {username.charAt(0).toUpperCase()}
                        </div>

                        <div>
                            <h4>{username}</h4>
                            <span>Student</span>
                        </div>
                    </div>

                    {/* SEARCH */}
                    <div className="club-search">
                        <span>🔍</span>

                        <input
                            type="text"
                            placeholder="Search clubs..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                        />
                    </div>

                    {/* CLUB COUNT */}
                    <div className="club-list-heading">
                        <span>MY JOINED CLUBS</span>

                        <span className="club-count">
                            {clubs.length}
                        </span>
                    </div>

                    {/* CLUB LIST */}
                    <div className="club-list">
                        {loadingClubs ? (
                            <p className="empty-message">
                                Loading clubs...
                            </p>
                        ) : error && clubs.length === 0 ? (
                            <p className="empty-message">
                                {error}
                            </p>
                        ) : filteredClubs.length === 0 ? (
                            <p className="empty-message">
                                No joined clubs found.
                            </p>
                        ) : (
                            filteredClubs.map(club => (
                                <div
                                    key={club._id}
                                    className={`club-item ${selectedClub?._id === club._id
                                            ? "active"
                                            : ""
                                        }`}
                                    onClick={() => {
                                        setError("");
                                        setSelectedClub(club);
                                    }}
                                >
                                    <div className="club-avatar">
                                        {getClubImage(club) ? (
                                            <img
                                                src={getClubImage(club)}
                                                alt={club.clubName}
                                                onError={e => {
                                                    e.currentTarget.style.display =
                                                        "none";
                                                    e.currentTarget.parentElement.textContent =
                                                        "🏫";
                                                }}
                                            />
                                        ) : (
                                            "🏫"
                                        )}
                                    </div>

                                    <div className="club-info">
                                        <h4>{club.clubName}</h4>

                                        <p>
                                            {club.category || "Campus Club"}
                                        </p>
                                    </div>

                                    <span className="club-arrow">
                                        ›
                                    </span>
                                </div>
                            ))
                        )}
                    </div>

                    <div className="sidebar-footer">
                        🎓 Campus Connect
                    </div>
                </aside>

                {/* RIGHT CHAT AREA */}
                <main className="chat-main">

                    {!selectedClub ? (
                        <div className="welcome-chat">
                            <div className="welcome-icon">💬</div>

                            <h2>Welcome to Club Chat</h2>

                            <p>
                                Select a club from the sidebar
                                to start a conversation.
                            </p>
                        </div>
                    ) : (
                        <>
                            {/* CHAT HEADER */}
                            <div className="chat-header">

                                <div className="chat-header-dp">
                                    {getClubImage(selectedClub) ? (
                                        <img
                                            src={getClubImage(selectedClub)}
                                            alt={selectedClub.clubName}
                                            onClick={() => setShowClubDP(true)}
                                            title="Click to view club picture"
                                            style={{
                                                cursor: "pointer"
                                            }}
                                            onError={(e) => {
                                                e.currentTarget.style.display = "none";
                                                e.currentTarget.parentElement.textContent = "🏫";
                                            }}
                                        />
                                    ) : (
                                        "🏫"
                                    )}
                                </div>

                                <div className="chat-header-info">
                                    <h3>{selectedClub.clubName}</h3>

                                    <p>
                                        {selectedClub.category || "Campus Club"}
                                        {" • "}
                                        {selectedClub.members?.length || 0}
                                        {" Members"}
                                    </p>
                                </div>
                            </div>

                            {/* MESSAGES */}
                            <div className="messages-area">

                                <div className="chat-date">
                                    <span>Club Conversation</span>
                                </div>

                                {loadingMessages ? (
                                    <div className="empty-chat">
                                        Loading messages...
                                    </div>
                                ) : messages.length === 0 ? (
                                    <div className="empty-chat">
                                        <div>👋</div>

                                        <h3>Start a conversation!</h3>

                                        <p>
                                            Say hello to your club members.
                                        </p>
                                    </div>
                                ) : (
                                    messages.map((msg, index) => {
                                        const mine = isMyMessage(msg);

                                        return (
                                            <div
                                                key={msg._id || index}
                                                className={`message-row ${mine
                                                        ? "my-row"
                                                        : "other-row"
                                                    }`}
                                            >
                                                <div
                                                    className={`message-bubble ${mine
                                                            ? "my-message"
                                                            : "other-message"
                                                        }`}
                                                >
                                                    {!mine && (
                                                        <div className="sender-name">
                                                            {getSenderName(msg)}
                                                        </div>
                                                    )}

                                                    {renderFile(msg)}

                                                    {msg.message && (
                                                        <p>{msg.message}</p>
                                                    )}

                                                    <span className="message-time">
                                                        {getTime(
                                                            msg.timestamp ||
                                                            msg.createdAt
                                                        )}

                                                        {mine && " ✓"}
                                                    </span>
                                                </div>
                                            </div>
                                        );
                                    })
                                )}

                                <div ref={messagesEndRef}></div>
                            </div>

                            {/* MESSAGE INPUT */}
                            <form
                                className="message-input-area"
                                onSubmit={sendMessage}
                            >
                                {selectedFile && (
                                    <div className="selected-file-preview">
                                        <span>📎</span>

                                        <span className="selected-file-name">
                                            {selectedFile.name}
                                        </span>

                                        <button
                                            type="button"
                                            onClick={() => {
                                                setSelectedFile(null);

                                                if (fileInputRef.current) {
                                                    fileInputRef.current.value = "";
                                                }
                                            }}
                                            aria-label="Remove selected file"
                                        >
                                            ×
                                        </button>
                                    </div>
                                )}

                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    hidden
                                    accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.mp3,.wav,.ogg,.m4a,.mp4,.webm,.mov"
                                    onChange={e =>
                                        setSelectedFile(
                                            e.target.files?.[0] || null
                                        )
                                    }
                                />

                                <button
                                    type="button"
                                    className="attach-button"
                                    title="Attach image or file"
                                    onClick={() =>
                                        fileInputRef.current?.click()
                                    }
                                    disabled={sending}
                                >
                                    📎
                                </button>

                                <input
                                    type="text"
                                    placeholder="Type a message..."
                                    value={messageText}
                                    onChange={e =>
                                        setMessageText(e.target.value)
                                    }
                                    disabled={sending}
                                />

                                <button
                                    type="submit"
                                    disabled={
                                        (!messageText.trim() && !selectedFile) ||
                                        sending
                                    }
                                >
                                    {sending ? "..." : "➤"}
                                </button>
                            </form>
                        </>
                    )}
                </main>
            </div>
            {showClubDP && selectedClub && getClubImage(selectedClub) && (
                <div
                    onClick={() => setShowClubDP(false)}
                    style={{
                        position: "fixed",
                        top: 0,
                        left: 0,
                        width: "100vw",
                        height: "100vh",
                        background: "rgba(0, 0, 0, 0.85)",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        zIndex: 999999
                    }}
                >
                    <button
                        type="button"
                        onClick={() => setShowClubDP(false)}
                        style={{
                            position: "absolute",
                            top: "25px",
                            right: "35px",
                            color: "white",
                            background: "transparent",
                            border: "none",
                            fontSize: "45px",
                            cursor: "pointer"
                        }}
                    >
                        ×
                    </button>

                    <div
                        onClick={(e) => e.stopPropagation()}
                        style={{
                            textAlign: "center"
                        }}
                    >
                        <img
                            src={getClubImage(selectedClub)}
                            alt={selectedClub.clubName}
                            style={{
                                width: "350px",
                                height: "350px",
                                maxWidth: "85vw",
                                maxHeight: "70vh",
                                objectFit: "contain",
                                borderRadius: "15px",
                                background: "white",
                                padding: "5px"
                            }}
                        />

                        <h2 style={{ color: "white" }}>
                            {selectedClub.clubName}
                        </h2>
                    </div>
                </div>
            )}

            {/* CSS */}
            <style>{`
                * {
                    box-sizing: border-box;
                }

                .club-chat-page {
                    min-height: 100vh;
                    padding: 25px;
                    background: linear-gradient(
                        135deg,
                        #e8edff,
                        #f5f7ff,
                        #e5f8f5
                    );
                    font-family: Arial, sans-serif;
                }

                .chat-container {
                    max-width: 1400px;
                    height: calc(100vh - 50px);
                    min-height: 600px;
                    margin: auto;
                    display: flex;
                    background: white;
                    border-radius: 20px;
                    overflow: hidden;
                    box-shadow: 0 12px 45px rgba(20, 35, 80, 0.15);
                }

                /* SIDEBAR */
                .chat-sidebar {
                    width: 340px;
                    min-width: 300px;
                    background: #111c36;
                    color: white;
                    display: flex;
                    flex-direction: column;
                }

                .sidebar-header {
                    padding: 25px 22px;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    border-bottom: 1px solid rgba(255,255,255,.1);
                }

                .sidebar-header h2 {
                    margin: 0;
                    font-size: 23px;
                    color: #f4c75e;
                }

                .sidebar-header p {
                    color: #aab7d2;
                    margin: 7px 0 0;
                    font-size: 12px;
                }

                .online-dot {
                    width: 10px;
                    height: 10px;
                    border-radius: 50%;
                    background: #35db8b;
                    box-shadow: 0 0 12px #35db8b;
                }

                .student-profile {
                    display: flex;
                    align-items: center;
                    gap: 13px;
                    padding: 20px 22px;
                    background: rgba(255,255,255,.04);
                }

                .profile-avatar {
                    width: 43px;
                    height: 43px;
                    border-radius: 50%;
                    background: linear-gradient(135deg, #f5c65d, #ff9e56);
                    color: #17213a;
                    display: grid;
                    place-items: center;
                    font-size: 20px;
                    font-weight: bold;
                }

                .student-profile h4 {
                    margin: 0 0 5px;
                }

                .student-profile span {
                    color: #aab7d2;
                    font-size: 12px;
                }

                /* SEARCH */
                .club-search {
                    margin: 18px;
                    padding: 12px;
                    display: flex;
                    gap: 10px;
                    background: #202d4b;
                    border-radius: 10px;
                }

                .club-search input {
                    border: none;
                    outline: none;
                    background: transparent;
                    color: white;
                    width: 100%;
                }

                .club-search input::placeholder {
                    color: #aab7d2;
                }

                .club-list-heading {
                    padding: 5px 22px 15px;
                    display: flex;
                    justify-content: space-between;
                    color: #aab7d2;
                    font-size: 11px;
                    font-weight: bold;
                    letter-spacing: 1px;
                }

                .club-count {
                    color: #f4c75e;
                }

                /* CLUB LIST */
                .club-list {
                    flex: 1;
                    overflow-y: auto;
                }

                .club-item {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    padding: 15px 20px;
                    cursor: pointer;
                    border-left: 4px solid transparent;
                    transition: .2s;
                }

                .club-item:hover {
                    background: #202d4b;
                }

                .club-item.active {
                    background: #263653;
                    border-left-color: #f4c75e;
                }

                .club-avatar {
                    width: 46px;
                    height: 46px;
                    flex-shrink: 0;
                    border-radius: 50%;
                    background: #334465;
                    display: grid;
                    place-items: center;
                    overflow: hidden;
                    font-size: 22px;
                }

                .club-avatar img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                }

                .club-info {
                    flex: 1;
                    min-width: 0;
                }

                .club-info h4 {
                    margin: 0 0 6px;
                    font-size: 14px;
                    overflow: hidden;
                    white-space: nowrap;
                    text-overflow: ellipsis;
                }

                .club-info p {
                    margin: 0;
                    color: #aab7d2;
                    font-size: 12px;
                }

                .club-arrow {
                    color: #f4c75e;
                    font-size: 25px;
                }

                .empty-message {
                    padding: 20px;
                    text-align: center;
                    color: #aab7d2;
                    font-size: 13px;
                }

                .sidebar-footer {
                    padding: 18px;
                    text-align: center;
                    border-top: 1px solid rgba(255,255,255,.1);
                    color: #aab7d2;
                    font-size: 12px;
                }

                /* CHAT AREA */
                .chat-main {
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                    min-width: 0;
                    background: #f5f7fb;
                }

                /* CHAT HEADER */
                .chat-header {
                    height: 90px;
                    min-height: 90px;
                    padding: 15px 25px;
                    background: #ffffff;
                    display: flex;
                    align-items: center;
                    gap: 15px;
                    border-bottom: 1px solid #e8eaf0;
                }

                .chat-header-dp {
                    width: 55px;
                    height: 55px;
                    min-width: 55px;
                    border-radius: 50%;
                    overflow: hidden;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: #fff2d2;
                    font-size: 25px;
                }

                .chat-header-dp img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                }

                .chat-header-info h3 {
                    margin: 0 0 7px;
                    color: #192641;
                    font-size: 21px;
                    font-weight: 700;
                }

                .chat-header-info p {
                    margin: 0;
                    color: #8993a7;
                    font-size: 13px;
                }

                /* MESSAGES */
                .messages-area {
                    flex: 1;
                    padding: 25px;
                    overflow-y: auto;
                    background-color: #f4f6fa;
                    background-image: radial-gradient(
                        #dce2ed 0.7px,
                        transparent 0.7px
                    );
                    background-size: 18px 18px;
                }

                .chat-date {
                    display: flex;
                    justify-content: center;
                    margin-bottom: 25px;
                }

                .chat-date span {
                    padding: 8px 16px;
                    border-radius: 20px;
                    background: white;
                    color: #8590a3;
                    font-size: 11px;
                    box-shadow: 0 2px 8px rgba(0,0,0,.05);
                }

                .message-row {
                    display: flex;
                    margin-bottom: 17px;
                }

                .my-row {
                    justify-content: flex-end;
                }

                .other-row {
                    justify-content: flex-start;
                }

                .message-bubble {
                    max-width: 70%;
                    min-width: 100px;
                    padding: 11px 14px 7px;
                    border-radius: 13px;
                    box-shadow: 0 2px 5px rgba(0,0,0,.05);
                    position: relative;
                }

                .my-message {
                    background: #d9f8e8;
                    color: #193b2b;
                    border-top-right-radius: 3px;
                }

                .other-message {
                    background: white;
                    color: #26334c;
                    border-top-left-radius: 3px;
                }

                .sender-name {
                    color: #526bd1;
                    font-size: 12px;
                    font-weight: bold;
                    margin-bottom: 6px;
                }

                .message-bubble p {
                    margin: 0;
                    font-size: 14px;
                    line-height: 1.5;
                    overflow-wrap: anywhere;
                }

                .message-time {
                    display: block;
                    margin-top: 5px;
                    text-align: right;
                    font-size: 10px;
                    color: #84918b;
                }

                /* EMPTY CHAT */
                .empty-chat {
                    height: 70%;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    color: #8993a7;
                    text-align: center;
                }

                .empty-chat div {
                    font-size: 42px;
                }

                .empty-chat h3 {
                    color: #26334c;
                    margin-bottom: 5px;
                }

                .empty-chat p {
                    font-size: 13px;
                }

                .welcome-chat {
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    text-align: center;
                    color: #8993a7;
                    padding: 25px;
                }

                .welcome-icon {
                    width: 90px;
                    height: 90px;
                    display: grid;
                    place-items: center;
                    background: #fff0ca;
                    border-radius: 50%;
                    font-size: 40px;
                }

                .welcome-chat h2 {
                    color: #26334c;
                    margin-bottom: 5px;
                }

                /* MESSAGE INPUT */
                .message-input-area {
                    display: flex;
                    gap: 12px;
                    align-items: center;
                    flex-wrap: wrap;
                    padding: 17px 22px;
                    background: white;
                    border-top: 1px solid #e8eaf0;
                }

                .message-input-area input[type="text"] {
                    flex: 1;
                    min-width: 0;
                    padding: 14px 17px;
                    border: 1px solid #e2e6ee;
                    border-radius: 25px;
                    outline: none;
                    font-size: 14px;
                }

                .message-input-area input[type="text"]:focus {
                    border-color: #536edb;
                }

                .message-input-area button {
                    width: 48px;
                    height: 48px;
                    flex-shrink: 0;
                    border: none;
                    border-radius: 50%;
                    background: #536edb;
                    color: white;
                    font-size: 22px;
                    cursor: pointer;
                    transition: .2s;
                }

                .message-input-area button:hover {
                    background: #344fc0;
                    transform: scale(1.05);
                }

                .message-input-area button:disabled {
                    opacity: .5;
                    cursor: not-allowed;
                    transform: none;
                }

                /* SHARED FILES */
                .chat-shared-image {
                    display: block;
                    max-width: 260px;
                    max-height: 280px;
                    width: auto;
                    height: auto;
                    object-fit: contain;
                    border-radius: 10px;
                    margin: 5px 0;
                }

                .chat-shared-video {
                    display: block;
                    width: min(280px, 100%);
                    border-radius: 10px;
                    margin: 5px 0;
                }

                .chat-shared-audio {
                    display: block;
                    max-width: 280px;
                    margin: 7px 0;
                }

                .chat-file-link {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    max-width: 280px;
                    padding: 10px;
                    margin: 6px 0;
                    border-radius: 10px;
                    background: rgba(255,255,255,.75);
                    color: #26334c;
                    text-decoration: none;
                    overflow-wrap: anywhere;
                }

                .chat-file-link > span:first-child {
                    font-size: 25px;
                }

                .chat-file-link > span:nth-child(2) {
                    display: flex;
                    flex: 1;
                    flex-direction: column;
                    min-width: 0;
                    gap: 4px;
                }

                .chat-file-link small {
                    color: #778198;
                }

                .selected-file-preview {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    max-width: 240px;
                    padding: 8px 10px;
                    border-radius: 10px;
                    background: #eef2ff;
                    color: #26334c;
                    font-size: 12px;
                }

                .selected-file-name {
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                    max-width: 150px;
                }

                .selected-file-preview button {
                    border: 0;
                    background: transparent;
                    color: #9b3340;
                    cursor: pointer;
                    font-size: 20px;
                    line-height: 1;
                }

                .message-input-area .attach-button {
                    background: #eef2ff;
                    color: #536edb;
                    font-size: 20px;
                }

                .message-input-area .attach-button:hover {
                    background: #dfe6ff;
                    transform: none;
                }

                /* RESPONSIVE */
                @media(max-width: 750px) {
                    .club-chat-page {
                        padding: 0;
                    }

                    .chat-container {
                        height: 100vh;
                        min-height: 0;
                        border-radius: 0;
                    }

                    .chat-sidebar {
                        width: 115px;
                        min-width: 115px;
                    }

                    .sidebar-header {
                        padding: 16px 8px;
                    }

                    .sidebar-header h2 {
                        font-size: 15px;
                    }

                    .sidebar-header p,
                    .online-dot,
                    .student-profile,
                    .club-search,
                    .club-list-heading,
                    .sidebar-footer,
                    .club-info p,
                    .club-arrow {
                        display: none;
                    }

                    .club-item {
                        flex-direction: column;
                        padding: 15px 5px;
                        text-align: center;
                    }

                    .club-info h4 {
                        font-size: 10px;
                        white-space: normal;
                    }

                    .chat-header {
                        padding: 12px;
                    }

                    .messages-area {
                        padding: 15px 10px;
                    }

                    .message-bubble {
                        max-width: 88%;
                    }

                    .message-input-area {
                        padding: 10px;
                        gap: 7px;
                    }

                    .message-input-area input[type="text"] {
                        flex: 1;
                    }
                }
            `}</style>
        </div>
    );
}

export default StudentClubChat;
