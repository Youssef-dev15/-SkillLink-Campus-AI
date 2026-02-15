import React, { useState } from "react";
import "./Messaging.css";

const MOCK_CONVERSATIONS = [
  {
    id: "c1",
    user: { name: "Sarah Benali", avatar: "https://picsum.photos/200?random=10", status: "online" },
    lastMessage: "See you at 5pm for revision?",
    time: "14:20",
    unread: true
  },
  {
    id: "c2",
    user: { name: "Lucas Martin", avatar: "https://picsum.photos/200?random=11", status: "offline" },
    lastMessage: "Thanks for the React help!",
    time: "Yesterday",
    unread: false
  },
  {
    id: "c3",
    user: { name: "Emma Roy", avatar: "https://picsum.photos/200?random=12", status: "online" },
    lastMessage: "Did you see next week's hackathon?",
    time: "Monday",
    unread: false
  }
];

export default function Messages() {
  const [open1, setOpen1] = useState(true);
  const [selectedId, setSelectedId] = useState(MOCK_CONVERSATIONS[0].id);
  const [messageText, setMessageText] = useState("");

  const currentChat = MOCK_CONVERSATIONS.find(c => c.id === selectedId);

  return (
    <div className="msg-app">
      <div className="msg-wrapper">

        {/* Sidebar */}
        <div className={`msg-sidebar${open1 ? " open" : ""}`}>
          <h2>Messages</h2>
          <div className="msg-search">
            <span>🔍</span>
            <input placeholder="Search a conversation..." />
          </div>

          <div className="msg-list">
            {MOCK_CONVERSATIONS.map(c => (
              <button
                key={c.id}
                className={`msg-item ${selectedId === c.id ? "active" : ""}`}
               onClick={() => {setSelectedId(c.id);setOpen1(false);}}

              >
                <div className="msg-avatar">
                  <img src={c.user.avatar} alt="" />
                  <span className={c.user.status}></span>
                </div>

                <div className="msg-info">
                  <div className="msg-top">
                    <b>{c.user.name}</b>
                    <small>{c.time}</small>
                  </div>
                  <p className={c.unread ? "unread" : ""}>{c.lastMessage}</p>
                </div>

                {c.unread && <div className="msg-dot"></div>}
              </button>
            ))}
          </div>
        </div>

        {/* Chat */}
        <div className={`msg-chat ${open1 ? " close" : ""}`}>
          {currentChat && (
            <>
              <div className="msg-header">
                <div className="msg-user">
                 <button className="back" onClick={() => setOpen1(true)}>⬅️</button><img src={currentChat.user.avatar} alt="" />
                  <div className="">
                    <b>{currentChat.user.name}</b>
                   
                  </div>
                </div>

                <div className="msg-actions">
                  <button>ℹ️</button>
                </div>
              </div>

              <div className="msg-messages">
                <div className="msg-bubble left">
                  Hi! I saw your profile — your React skills are impressive.
                  Want to study together?
                  <span>14:15</span>
                </div>

                <div className="msg-bubble right">
                  Sure! I struggle a bit with hooks state management 😅
                  <span>14:18</span>
                </div>

                <div className="msg-bubble left">
                  {currentChat.lastMessage}
                  <span>14:20</span>
                </div>
              </div>

              <div className="msg-input">
                <button className="msg-attach">📎</button>
                <input
                  value={messageText}
                  onChange={e => setMessageText(e.target.value)}
                  placeholder="Write your message..."
                />
                <button className="msg-send">Send</button>
              </div>
            </>
          )}
        </div>

      </div>
    </div>
  );
}
