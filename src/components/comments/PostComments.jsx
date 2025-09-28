import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import CommentItem from './CommentItem';

const PostComments = ({ comments = [], post, setPost }) => {
  const currentUser = useSelector((state) => state.auth.user);
  const isPostOwner = currentUser?.id && post?.user?.id && currentUser.id === post.user.id;
  return (
    <div className="post-comment-cont">
      {/* sort-by dropdown */}
      <div className="top">
        <div className="dropdown d-inline-block" data-bs-toggle="dropdown">
          <p className="dropdown-toggle">Most relevant</p>
          <ul className="dropdown-menu">
            <li><a className="dropdown-item" href="#">Most Liked</a></li>
            <li><a className="dropdown-item" href="#">Latest</a></li>
            <li><a className="dropdown-item" href="#">All</a></li>
          </ul>
        </div>
      </div>

      {/* comment list */}
      <div className="bottom">
        {comments.length > 0 ? (
          comments
            .filter((c) => {
              return isPostOwner ? true : c.approved === 'approved';
            })
            .map((c) => (
              <CommentItem
                key={c.id}
                comment={c}
                post={post}
                setPost={setPost}
              />
            ))
        ) : (
          <p className="text-muted">No comments yet.</p>
        )}
      </div>
    </div>
  );
};

PostComments.propTypes = {
  comments: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      text: PropTypes.string.isRequired,
      created_at: PropTypes.string.isRequired,
      like_count: PropTypes.number.isRequired,
      liked_by: PropTypes.number,
      user: PropTypes.shape({
        id: PropTypes.number,
        name: PropTypes.string,
        avatar_url: PropTypes.string,
      }),
      post_id: PropTypes.number.isRequired,
    })
  ),
  post: PropTypes.object,
  setPost: PropTypes.func.isRequired,
};

export default PostComments;

