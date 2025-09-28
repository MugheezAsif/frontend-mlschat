import React from 'react';

const Comment = ({ avatarUrl, name, text, timeAgo, likeCount = 0 }) => {
  return (
    <div className="comment mb-3 d-flex flex-column">
      <div className="d-flex gap-3">
        <img
          src={avatarUrl}
          className="img-fluid comment-img rounded-circle"
          alt={name}
        />
        <div className="comment-cont">
          <div className="info comment-bubble">
            <p className="text-black m-0 text-start">
              <strong>{name}</strong>
            </p>
            <p className="m-0 text-start">{text}</p>
          </div>
          <div className="comment-actions">
            <div className="d-flex justify-content-between align-items-center">
              <div className="d-flex align-items-center gap-2">
                <p className="m-0">{timeAgo}</p>
                <a href="#" className={likeCount > 0 ? 'active' : 'inactive-like'}>
                  Like
                </a>
              </div>
              <p className="m-0 like-count">
                {likeCount} <i className="fa-solid fa-thumbs-up"></i>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Comment;
