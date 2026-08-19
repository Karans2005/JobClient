import React from "react";

export default function ChatPage(props) {
  const {
    providers,
    chatProvider,
    setChatProvider,
    chatMessages,
    chatText,
    setChatText,
    sendChat,
  } = props;

  return (
    <div className="card">
      <h3>💬 Provider Chat</h3>

      <div className="toolbar">
        {providers.map((p) => (
          <button
            key={p.id}
            className="btn"
            onClick={() => setChatProvider(p)}
          >
            {p.name}
          </button>
        ))}
      </div>

      {!chatProvider ? (
        <div className="small">
          Select a provider to start chatting.
        </div>
      ) : (
        <>
          <h4>Chat with {chatProvider.name}</h4>

          <div className="chat-box">
            {chatMessages.length === 0 && (
              <div className="small">
                Start the conversation...
              </div>
            )}

            {chatMessages.map((m) => (
              <div
                className={`chat-msg ${
                  m.sender === "me" ? "me" : ""
                }`}
                key={m.id}
              >
                {m.text}

                <div className="small">
                  {new Date(m.time).toLocaleTimeString()}
                </div>
              </div>
            ))}
          </div>

          <div className="action-row">
            <input
              value={chatText}
              onChange={(e) => setChatText(e.target.value)}
              placeholder="Type a message..."
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  sendChat();
                }
              }}
            />

            <button className="btn" onClick={sendChat}>
              Send
            </button>
          </div>
        </>
      )}
    </div>
  );
}