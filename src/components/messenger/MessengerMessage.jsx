import React from "react";

const MessengerMessage = ({ message, contactAvatar }) => {
  if (message.from === "me") {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', maxWidth: 'calc(100% - 40px)', marginLeft: 'auto' }}>

        <div
          className="p-2 px-3 rounded shadow"
          style={{
            background: '#EDE9FE',
            color: '#222',
            borderRadius: '18px 18px 6px 18px',
            fontSize: 15,
            minWidth: 80,
            maxWidth: 400,
            position: 'relative',
          }}
        >
          {message.text}
        </div>
        <div className="d-flex align-items-center mt-1" style={{ fontSize: 12, opacity: 0.7 }}>
          <span>{message.time}</span>
          <span style={{ marginLeft: 6 }}>
            {message.allReadByOthers ? (
              <i className="fa fa-check-double" title="Read" />
            ) : (
              <i className="fa fa-check" title="Sent" />
            )}
          </span>
          <img src={contactAvatar} alt="me" style={{ width: 22, height: 22, borderRadius: '50%', marginLeft: 4 }} />
        </div>
      </div>
    );
  } else {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', maxWidth: 'calc(100% - 40px)', marginRight: 'auto' }}>
        <div className="d-flex align-items-end">
          <img src={contactAvatar} alt="them" className="rounded-circle me-2" style={{ width: 22, height: 22, marginBottom: 2 }} />
          <div
            className="p-2 px-3 rounded shadow"
            style={{
              background: '#F1F5F9',
              color: '#222',
              fontSize: 15,
              minWidth: 80,
              maxWidth: 400,
              position: 'relative',
            }}
          >
            {message.text}
          </div>
        </div>
        <div className="d-flex align-items-center mt-1" style={{ fontSize: 12, opacity: 0.7 }}>
          <span>{message.time}</span>
        </div>
      </div>
    );
  }
};

export default MessengerMessage; 